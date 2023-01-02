import { Room, Client } from "colyseus";

export class SignalingRoom extends Room {

  onCreate(options: any) {
    this.onMessage("candidate", this.onCandidate.bind(this));
    this.onMessage("desc", this.onDesc.bind(this));
  }

  onCandidate(client: Client, message: any) {
    this.broadcast("candidate", message, {
      except: client
    });
  }

  onDesc(client: Client, message: any) {
    this.broadcast("desc", message, {
      except: client
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    this.clients.forEach((value: Client, index: number, array: Client[]) => {
      value.send("addPeer", {
        sessionId: client.sessionId,
        shouldCreateOffer: false,
      });
      if (value.sessionId != client.sessionId) {
        client.send("addPeer", {
          sessionId: value.sessionId,
          shouldCreateOffer: true,
        });
      }
    });
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
