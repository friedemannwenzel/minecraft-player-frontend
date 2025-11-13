import { NextResponse } from 'next/server';
import { status } from 'minecraft-server-util';

const SERVER_IP = process.env.MINECRAFT_SERVER_IP;
const SERVER_PORT = process.env.MINECRAFT_SERVER_PORT 
  ? parseInt(process.env.MINECRAFT_SERVER_PORT, 10) 
  : 25565;

export async function GET() {
  if (!SERVER_IP) {
    return NextResponse.json(
      {
        online: false,
        error: 'Server configuration missing',
      },
      { status: 500 }
    );
  }

  try {
    const response = await status(SERVER_IP, SERVER_PORT, {
      timeout: 5000,
    });

    return NextResponse.json({
      online: true,
      players: {
        online: response.players.online,
        max: response.players.max,
      },
      version: response.version.name,
      motd: response.motd.clean,
    });
  } catch (error) {
    console.error('Error querying Minecraft server:', error);
    return NextResponse.json(
      {
        online: false,
        error: 'Failed to connect to server',
      },
      { status: 500 }
    );
  }
}

