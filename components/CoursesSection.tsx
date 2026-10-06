'use client';

import React, { useState } from 'react';
import { Course } from '@/lib/types';
import CourseDetailModal from './CourseDetailModal';
import { Clock, Laptop, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

interface CoursesSectionProps {
  courses: Course[];
  whatsappClean?: string;
  limit?: number;
}

export default function CoursesSection({
  courses,
  whatsappClean = '5511970539746',
  limit,
}: CoursesSectionProps) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const displayCourses = limit ? courses.slice(0, limit) : courses;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayCourses.map((course) => (
          <article
            key={course.id}
            className="group bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-subtle hover:shadow-soft hover:border-brand-200 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-brand-50 text-brand-800 border border-brand-100">
                  {course.kicker}
                </span>
                {course.badge && (
                  <span className="text-[11px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-accent-50 text-accent-800 border border-accent-200">
                    {course.badge}
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-800 transition-colors leading-snug">
                  {course.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 line-clamp-3 leading-relaxed">
                  {course.shortDesc}
                </p>
              </div>

              <div className="pt-2 space-y-1.5 text-xs text-slate-500 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-accent-500" />
                  <span>{course.cargaHoraria}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Laptop className="w-3.5 h-3.5 text-brand-600" />
                  <span>{course.modalidade}</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={() => setSelectedCourse(course)}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold bg-slate-100 text-brand-900 hover:bg-brand-900 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <span>Saiba mais sobre o curso</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedCourse && (
        <CourseDetailModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          whatsappClean={whatsappClean}
        />
      )}
    </>
  );
}
