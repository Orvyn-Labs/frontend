import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FundingProgress } from "./FundingProgress";
import { shortenAddress, formatDeadline, statusLabel, statusColor, isExpired } from "@/lib/utils";
import type { ProjectData } from "@/hooks/useProjects";
import { Clock, User } from "lucide-react";
import { motion } from "framer-motion";

interface ProjectCardProps {
  project: ProjectData;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const expired = isExpired(project.deadline);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
    >
      <Link href={`/projects/${project.address}`}>
        <Card className="h-full flex flex-col glass-morphism hover:border-blue-500/50 transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-xl hover:shadow-blue-500/10">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-base leading-tight group-hover:text-blue-400 transition-colors line-clamp-2">
                {project.title}
              </h3>
              <Badge
                variant="outline"
                className={`${statusColor(project.status)} whitespace-nowrap`}
              >
                {statusLabel(project.status)}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="flex-1 space-y-5">
            <div className="space-y-2">
              <FundingProgress raised={project.totalRaised} goal={project.goalAmount} />
            </div>

            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5">
                <User className="h-3.5 w-3.5 text-blue-400" />
                <span className="font-mono">{shortenAddress(project.researcher)}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5">
                <Clock className="h-3.5 w-3.5 text-amber-400" />
                <span className={expired ? "text-red-400 font-semibold" : ""}>
                  {expired ? "Expired " : "Deadline: "}
                  {formatDeadline(project.deadline)}
                </span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-2 pb-4">
            <div className="w-full flex items-center justify-between text-[10px] font-mono opacity-50 group-hover:opacity-100 transition-opacity">
              <span className="truncate max-w-[150px]">{project.address}</span>
              <span className="text-blue-400 font-bold">Details →</span>
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}
