import XLSX from 'xlsx';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface DonationCenterRow {
  Hospital_Name: string;
  Address_Original_First_Line: string;
  District: string;
  State: string;
  Pincode: number | string;
  Telephone?: string;
  Mobile_Number?: string;
}

async function importDonationCenters() {
  try {
    const workbook = XLSX.readFile('scripts/hospital_directory.xlsx'); // Adjusted path
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData: DonationCenterRow[] = XLSX.utils.sheet_to_json(sheet);

    for (const row of jsonData) {
      const { Hospital_Name: name, Address_Original_First_Line: address, District: city, State: state, Pincode, Telephone, Mobile_Number } = row;
      const postalCode = Pincode?.toString();
      const phone = Telephone || Mobile_Number || '';

      if (!name || !address || !city || !state || !postalCode) {
        console.warn('Skipping row due to missing fields:', row);
        continue;
      }

      try {
        await prisma.donationCenter.create({
          data: {
            name,
            address,
            city,
            state,
            postalCode,
            phone,
          },
        });
        console.log(`✅ Successfully inserted: ${name}`);
      } catch (err) {
        console.error(`❌ Error inserting ${name}:`, err);
      }
    }
  } catch (err) {
    console.error('❌ Failed to import donation centers:', err);
  } finally {
    await prisma.$disconnect();
  }
}

importDonationCenters();