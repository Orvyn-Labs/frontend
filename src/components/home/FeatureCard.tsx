"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

export function FeatureCard({ icon: Icon, title, description, index }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
    >
      <Card className="glass-morphism h-full group transition-all duration-300 hover:shadow-[0_20px_40px_rgba(59,130,246,0.1)] overflow-hidden relative">
        {/* Glow effect on hover */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -z-10 group-hover:bg-blue-500/10 transition-colors" />
        
        <CardHeader className="pb-3">
          <div className="rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 w-12 h-12 flex items-center justify-center mb-4 border border-blue-500/20 group-hover:scale-110 transition-transform duration-300">
            <Icon className="h-6 w-6 text-blue-400" />
          </div>
          <CardTitle className="text-xl font-bold tracking-tight text-foreground group-hover:text-blue-400 transition-colors">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
