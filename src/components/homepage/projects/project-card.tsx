import * as React from "react";
import { ProjectData } from "@/utils/data/projects-data";
import WindowBox from "@/components/WindowBox";

function ProjectCard({ project }: { project: ProjectData }) {
  return (
    <WindowBox title={project.name}>
      <code className="font-mono text-xs md:text-sm lg:text-base">
        <div className="blink">
          <span className="mr-2 text-pink-500">const</span>
          <span className="mr-2 text-white">project</span>
          <span className="mr-2 text-pink-500">=</span>
          <span className="text-gray-400">{"{"}</span>
        </div>
        <div>
          <span className="ml-4 lg:ml-8 mr-2 text-white">name:</span>
          <span className="text-gray-400">{`'`}</span>
          <span className="text-amber-300">{project.name}</span>
          <span className="text-gray-400">{`',`}</span>
        </div>

        <div className="ml-4 lg:ml-8 mr-2">
          <span className=" text-white">tools:</span>
          <span className="text-gray-400">{` ['`}</span>
          {project.tools.map((tag, i) => (
            <React.Fragment key={i}>
              <span className="text-amber-300">{tag}</span>
              {project.tools.length - 1 !== i && (
                <span className="text-gray-400">{`', '`}</span>
              )}
            </React.Fragment>
          ))}
          <span className="text-gray-400">{"],"}</span>
        </div>
        <div>
          <span className="ml-4 lg:ml-8 mr-2 text-white">myRole:</span>
          <span className="text-gray-400">{`'`}</span>
          <span className="text-amber-300">{project.role}</span>
          <span className="text-gray-400">{`',`}</span>
        </div>
        <div className="ml-4 lg:ml-8 mr-2">
          <span className="text-white">Description:</span>
          <span className="text-cyan-400">{" " + project.description}</span>
          <span className="text-gray-400">,</span>
        </div>
        <div>
          <span className="text-gray-400">{`};`}</span>
        </div>
      </code>
    </WindowBox>
  );
}

export default ProjectCard;
