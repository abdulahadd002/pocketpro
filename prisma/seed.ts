import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  { name: "Sports", icon: "Trophy", color: "#22c55e" },
  { name: "Outings", icon: "MapPin", color: "#3b82f6" },
  { name: "Food", icon: "UtensilsCrossed", color: "#f59e0b" },
  { name: "Transport", icon: "Car", color: "#8b5cf6" },
  { name: "Entertainment", icon: "Gamepad2", color: "#ec4899" },
  { name: "Education", icon: "BookOpen", color: "#06b6d4" },
  { name: "Other", icon: "MoreHorizontal", color: "#6b7280" },
];

async function main() {
  console.log("Seeding database...");

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
