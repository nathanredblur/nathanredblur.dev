---
title: "How I Turned My Mac Mini Into a Home Server with Portless"
published: 2026-05-30
description: "From nginx reverse proxies to simple HTTPS local domains in minutes. Here's how Portless transformed my Mac mini server setup."
image: ./cover.png
tags: ["Tools", "macOS", "Tutorial", "CLI", "Productivity"]
category: "Tutorials"
draft: true
---

I've been running services on my Mac mini M1 for a while now — AdGuard Home, local dev servers, various tools I want accessible from any device on my network. For the longest time, I used nginx as a reverse proxy combined with AdGuard Home DNS to route custom local domains to the right ports.

It worked, but it was tedious. Every new service meant editing nginx configs, reloading the service, and hoping I didn't break something. And no HTTPS unless I generated self-signed certificates and dealt with browser warnings.

Then I found [Portless](https://portless.sh/), and my entire setup became embarrassingly simple.

## The Old Way: nginx + DNS Wildcards

Here's what I used to do:

1. Configure AdGuard Home to resolve all `*.navi.local` subdomains to my Mac mini's IP (`192.168.0.115`)
2. Set up nginx to listen on port 80 and proxy requests based on the subdomain
3. Add a new nginx location block for each service

For example, to access AdGuard Home at `adguard.navi.local`, I had an nginx config like this:

```nginx
server {
    listen 80;
    server_name adguard.navi.local;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Every. Single. Service. Needed this boilerplate.

And I was stuck with HTTP. Getting HTTPS working with self-signed certs was more hassle than it was worth for a local setup.

## Enter Portless

Portless is a zero-config local domain proxy. You run it once, register your services with a single command, and get HTTPS local domains automatically.

No nginx configs. No certificate management. No DNS trickering beyond the initial setup.

::github{repo="vercel-labs/portless"}

## Setting Up Portless on My Mac Mini

The entire setup took me about 5 minutes.

### Installation

```bash
npm install -g portless
```

That's it. One command.

### Install the Service in LAN Mode

This should be straightforward — just install the service with your LAN settings:

```bash
portless service install --lan --ip 192.168.0.115
```

In theory, that's all you need. The service should run in the background and survive reboots.

### The Current Bug (and the Fix)

Here's where I hit a snag. As of now, there's a bug where `portless service install` doesn't properly save the `--lan` and `--ip` arguments to the LaunchDaemon configuration. The service installs, but without those critical flags.

The workaround is to manually edit the plist file:

```bash
sudo code /Library/LaunchDaemons/sh.portless.proxy.plist
```

Find the `<key>ProgramArguments</key>` section and add the missing `--lan` and `--ip` arguments:

```xml
<key>ProgramArguments</key>
<array>
  <string>/path/to/node</string>
  <string>/path/to/portless</string>
  <string>proxy</string>
  <string>start</string>
  <string>--foreground</string>
  <string>--port</string>
  <string>443</string>
  <string>--https</string>
  <string>--skip-trust</string>
  <string>--lan</string>
  <string>--ip</string>
  <string>192.168.0.115</string>
</array>
```

The paths will match your Node.js installation. In my case with mise, they point to `~/.local/share/mise/installs/node/22.22.2/bin/`.

### Restarting the Service

The service doesn't restart cleanly with standard commands. I had to use `launchctl` directly:

```bash
# Stop the service
sudo launchctl bootout system/sh.portless.proxy

# Verify it's stopped
sudo launchctl list | grep portless

# Start it with the updated configuration
sudo launchctl bootstrap system /Library/LaunchDaemons/sh.portless.proxy.plist
```

Now the service is running with the correct LAN mode settings.

### Register Your Services

With the service finally running correctly, you can register your aliases:

```bash
portless alias adguard 3210
```

You should see:

```
Alias registered: adguard.local -> 127.0.0.1:3210
```

Notice it uses `.local`, not `.localhost`. This is important for network-wide access via mDNS.

## What I Get Now

After running those commands, I can access AdGuard Home from any device on my network:

```
https://adguard.local
```

HTTPS works. Portless automatically generates certificates from its own CA. No browser warnings.

Want to add another service? One command:

```bash
portless alias jellyfin 8096
portless alias homeassistant 8123
portless alias vscode 8080
```

Now I have:
- `https://jellyfin.local`
- `https://homeassistant.local`
- `https://vscode.local`

All with HTTPS. All accessible across my network using `.local` domains that work seamlessly via mDNS.

## Checking What's Running

To see all registered services:

```bash
portless list
```

Output:
```
adguard → https://adguard.local
jellyfin → https://jellyfin.local
homeassistant → https://homeassistant.local
vscode → https://vscode.local
```

Clean. Simple. Exactly what you need to know.

## Why This Is Better

Compared to my old nginx setup:

**Before:**
- Edit nginx config file
- Test config for syntax errors
- Reload nginx service
- Hope nothing broke
- Still stuck with HTTP or deal with self-signed cert warnings

**Now:**
- `portless alias name port`
- Done

The HTTPS part alone is worth it. I don't have to deal with browser warnings, and I don't have to manually install root certificates on every device.

And because everything uses the `.local` domain, I don't need the DNS wildcard setup anymore. Portless handles its own `.local` domain resolution via mDNS (Bonjour on macOS).

:::tip[One Caveat]
If you want devices outside your local network to access these services (via VPN, for example), you'll still need to configure your DNS accordingly. Portless focuses on local network access, which is exactly what I needed.
:::

## When You Should Use Portless

Portless is perfect if you:

- Run multiple services on a local server (Mac mini, Raspberry Pi, old laptop)
- Want clean domain names instead of remembering ports
- Want HTTPS on your local network without certificate headaches
- Prefer CLI tools over editing config files

It's not trying to replace production reverse proxies. It's solving the local development and home lab problem, and it does that exceptionally well.

## My Current Setup

My Mac mini now runs:
- AdGuard Home (DNS filtering)
- Jellyfin (media server)
- VS Code Server (remote development)
- Home Assistant (smart home hub)
- A few experimental web apps

All accessible via clean HTTPS domains. All managed with a handful of terminal commands.

I still use nginx at work for production deployments. But for my home server? Portless replaced an entire stack of configuration with a tool that just works.

If you're running services on your local network and tired of managing reverse proxy configs, give Portless a shot. The LAN mode makes it especially useful for home servers that need to be accessible from multiple devices.

## Bonus: Sharing the Certificate with Other Devices

While Portless works great on the Mac mini where it's installed, other devices on your network will see certificate warnings until they trust Portless's CA certificate.

Instead of manually copying the certificate file to each device, I use `serve` to create a simple web page where any device can download it.

::github{repo="vercel/serve"}

Install serve:

```bash
npm install -g serve
```

Then serve the Portless certificates directory:

```bash
serve ~/.portless
```

Now any device on your network can visit `http://your-mac-ip:3000` and download the CA certificate. Once they install and trust it, all your `.local` domains will work without warnings.

This is especially handy when you have multiple laptops, phones, or tablets that need access to your services.

## Resources

- [Portless Documentation](https://portless.sh/docs)
- [Portless GitHub](https://github.com/vercel-labs/portless)
