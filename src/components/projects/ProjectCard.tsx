import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FundingProgress } from "./FundingProgress";
import { shortenAddress, formatDeadline, statusLabel, statusColor, isExpired } from "@/lib/utils";
import type { ProjectData } from "@/hooks/useProjects";
import { Clock, User } from "lucide-react";

interface ProjectCardProps {
  project: ProjectData;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const expired = isExpired(project.deadline);

  return (
    <Link href={`/projects/${project.address}`}>
      <Card className="h-full flex flex-col hover:border-blue-500/50 transition-colors cursor-pointer group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm leading-tight group-hover:text-blue-400 transition-colors line-clamp-2">
              {project.title}
            </h3>
            <Badge
              variant="outline"
              className={statusColor(project.status)}
            >
              {statusLabel(project.status)}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex-1 space-y-4">
          <FundingProgress raised={project.totalRaised} goal={project.goalAmount} />

          <div className="space-y-1.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <User className="h-3 w-3" />
              <span className="font-mono">{shortenAddress(project.researcher)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              <span className={expired ? "text-red-400" : ""}>
                {expired ? "Expired " : "Deadline: "}
                {formatDeadline(project.deadline)}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <span className="text-xs text-blue-400 font-mono truncate">
            {project.address}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
