import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const articles = [
  {
    title: "AI Breakthrough: New Model Achieves Human-Level Understanding",
    description: "Researchers announce a revolutionary AI system that demonstrates unprecedented comprehension of complex human concepts, marking a significant milestone in artificial intelligence development.",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
    source: "TechNews Daily"
  },
  {
    title: "Climate Change: Arctic Ice Melting Faster Than Predicted",
    description: "Latest satellite data reveals Arctic ice sheets are disappearing at twice the rate scientists previously estimated, raising urgent concerns about rising sea levels.",
    imageUrl: "https://images.unsplash.com/photo-1569163139394-de4798aa62b6",
    source: "Environmental Times"
  },
  {
    title: "Space Tourism Takes Off: First Commercial Flight Success",
    description: "Private space company successfully completes its first commercial tourist flight, carrying civilians to the edge of space and back safely.",
    imageUrl: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06",
    source: "Space Explorer"
  },
  {
    title: "Revolutionary Battery Technology Promises 10x Capacity",
    description: "Scientists develop new battery technology using quantum materials that could store 10 times more energy than current lithium-ion batteries.",
    imageUrl: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5",
    source: "Innovation Weekly"
  },
  {
    title: "Global Food Crisis: Solutions Through Vertical Farming",
    description: "Urban vertical farms show promise in addressing food security challenges, producing 100 times more food per square foot than traditional farming.",
    imageUrl: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8",
    source: "Agriculture Today"
  },
  {
    title: "Cryptocurrency Adoption: Major Banks Join Digital Revolution",
    description: "Leading financial institutions announce plans to offer cryptocurrency services, signaling mainstream acceptance of digital currencies.",
    imageUrl: "https://images.unsplash.com/photo-1621761191319-c6fb62004040",
    source: "Finance Report"
  },
  {
    title: "Mental Health Crisis: New App Shows Promising Results",
    description: "Digital therapy app demonstrates 70% success rate in treating anxiety and depression, offering hope for accessible mental health care.",
    imageUrl: "https://images.unsplash.com/photo-1493836164502-9fed1e013d8a",
    source: "Health Monitor"
  },
  {
    title: "Ocean Cleanup Project Removes Million Tons of Plastic",
    description: "International ocean cleanup initiative successfully removes over one million tons of plastic waste from the Pacific Ocean using innovative technology.",
    imageUrl: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7",
    source: "Ocean Guardian"
  },
  {
    title: "Education Revolution: VR Classrooms Transform Learning",
    description: "Virtual reality education platforms show 300% improvement in student engagement and retention, reshaping the future of learning.",
    imageUrl: "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d",
    source: "Education Insider"
  },
  {
    title: "Renewable Energy Milestone: Solar Now Cheaper Than Coal",
    description: "Solar energy costs drop below coal for the first time globally, accelerating the transition to clean energy worldwide.",
    imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276",
    source: "Energy Tribune"
  }
];

async function main() {
  console.log('Seeding database...');
  
  for (const article of articles) {
    await prisma.article.create({
      data: {
        ...article,
        isUserCreated: false
      }
    });
  }
  
  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });