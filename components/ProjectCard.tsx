'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

interface Project {
  id: number;
  title: string;
  image: string;
  slug: string;
}

interface ProjectCardProps {
  project: Project;
  priorityLoad?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, priorityLoad = false }) => {
  return (
    <Link 
      href={`/project/${project.slug}`} 
      className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 flex flex-col border border-slate-100 h-full"
    >
      {/* حاوية الصورة - تظهر كاملة بدون قص */}
      <div className="relative w-full aspect-[4/3] bg-slate-50 overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          priority={priorityLoad}
          className="object-contain p-4 transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      
      <div className="p-6 flex flex-col flex-grow text-right"> 
        <h3 className="text-xl font-black text-[#1a365d] mb-4 group-hover:text-sky-600 transition-colors line-clamp-2">
          {project.title}
        </h3>
        <div className="mt-auto pt-4 border-t border-slate-50"> 
          <span className="flex items-center justify-end text-sm font-bold text-sky-600 gap-2">
            <span>عرض التفاصيل</span>
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-2" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;