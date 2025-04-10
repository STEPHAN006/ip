import { NextResponse } from 'next/server';
import path from 'path';
const IP2Location = require("ip2location-nodejs");

// Fonction de validation d'IP
function isValidIP(ip: string): boolean {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ip = searchParams.get('ip');

  if (!ip) {
    return NextResponse.json(
      { error: 'Adresse IP manquante' },
      { status: 400 }
    );
  }

  if (!isValidIP(ip)) {
    return NextResponse.json(
      { error: 'Format d\'adresse IP invalide' },
      { status: 400 }
    );
  }

  const ip2location = new IP2Location();
  
  try {
    const dbPath = path.join(process.cwd(), 'IP2LOCATION-LITE-DB1.BIN');
    ip2location.open(dbPath);
    
    const result = ip2location.getAll(ip);
    
    if (!result || !result.country_long) {
      return NextResponse.json(
        { error: 'Adresse IP non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      country: result.country_long,
      region: result.region,
      city: result.city,
      latitude: result.latitude,
      longitude: result.longitude,
      isp: result.isp
    });
  } catch (error) {
    console.error('Erreur de géolocalisation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la géolocalisation' },
      { status: 500 }
    );
  } finally {
    if (ip2location) {
      ip2location.close();
    }
  }
}