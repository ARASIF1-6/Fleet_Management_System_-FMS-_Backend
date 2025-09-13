import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// This array contains all the static checklist questions from your image.
const checklistItems = [
  {
    displayOrder: 1,
    area: 'Windscreen, Windows and Mirrors',
    requirement: '• Mirrors are fitted and properly aligned and secure\n• All windows are clean and not obscured/damaged\n• All windows operational',
  },
  {
    displayOrder: 2,
    area: 'Washers and Wipers',
    requirement: '• Wipers move when switched on\n• Wiper blade must clear the windscreen\n• Washers are operational\n• Washer fluid is topped up',
  },
  {
    displayOrder: 3,
    area: 'Lights',
    requirement: '• All lights and indicators work correctly\n• All senses are present, clean and in good condition and are the correct colour\n• Stop lamps come on when then service brake is applied and goes out when released',
  },
  {
    displayOrder: 4,
    area: 'Seats and Seatbelts',
    requirement: '• All seats are secure\n• All seatbelts must operate correctly and must be free from damage',
  },
  {
    displayOrder: 5,
    area: 'Brakes',
    requirement: '• Foot/service brake works correctly\n• Hand/parking brake works correctly',
  },
  {
    displayOrder: 6,
    area: 'Bodywork and Doors',
    requirement: '• All doors must shut securely and stay open when required\n• No sharp edges or excess corrosion\n• No loose bodywork',
  },
  {
    displayOrder: 7,
    area: 'Tyres and Wheels',
    requirement: '• Minimum tread depth of 1.6mm\n• Correctly inflated\n• No visible damage',
  },
  {
    displayOrder: 8,
    area: 'Licence Plates and other identifiers',
    requirement: '• All plates and mandatory signs displayed, clean and secure\n• Roof Light is safe and operational (if fitted)\n• Taxi Meter (if fitted) seal is intact and correct\n• Fare Tariff (if required) displayed',
  },
];

async function main() {
  console.log('Start seeding...');
  
  // Create all checklist items from the array
  await prisma.checklistItem.createMany({
    data: checklistItems,
    skipDuplicates: true, // This will prevent errors if you run the seed script multiple times
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });