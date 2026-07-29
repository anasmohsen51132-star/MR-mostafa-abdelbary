// prisma/fix-teacher-text.ts
//
// One-off fix: the SiteSettings singleton row was created before the site
// was re-themed from "Arabic language" to "Chemistry". Prisma's @default(...)
// values (and the fallback in src/lib/site-settings.ts) only apply when the
// row doesn't exist yet — since it already exists in this DB, those new
// defaults never reached it. This script force-updates the existing row
// directly so the old "اللغة العربية" text is replaced everywhere it's read
// from (hero title, teacher title/bio, platform tagline, features list).
//
// Run once with:
//   npx ts-node prisma/fix-teacher-text.ts
// (uses the same DATABASE_URL from your .env that `next build` / the app uses)

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const updated = await prisma.siteSettings.update({
    where: { id: "singleton" },
    data: {
      heroTitle: "اتقن الكيمياء",
      teacherTitle: "خبير تدريس الكيمياء",
      teacherBio:
        "معلم متميز بخبرة تزيد عن خمس عشرة عاماً في تدريس الكيمياء لجميع المراحل الدراسية",
      platformTagline: "لتدريس الكيمياء",
      features: [
        { icon: "📖", title: "محتوى شامل", desc: "دروس متكاملة تغطي جميع جوانب الكيمياء" },
        { icon: "🎯", title: "تعلم هادف", desc: "منهج مدروس يضمن التقدم المستمر" },
        { icon: "💡", title: "أسلوب مبتكر", desc: "طرق تدريس حديثة تجعل التعلم ممتعاً" },
      ],
    },
  });

  console.log("✅ تم تحديث بيانات المنصة بنجاح:");
  console.log({
    heroTitle: updated.heroTitle,
    teacherTitle: updated.teacherTitle,
    teacherBio: updated.teacherBio,
    platformTagline: updated.platformTagline,
  });
}

main()
  .catch((e) => {
    console.error("❌ فشل التحديث:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
