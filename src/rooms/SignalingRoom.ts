import { Room, Client } from "colyseus";

export class SignalingRoom extends Room {

  onCreate(options: any) {
    this.onMessage("candidate", this.onCandidate.bind(this));
    this.onMessage("desc", this.onDesc.bind(this));
  }

  onCandidate(client: Client, message: any) {
    const sessionId = message.sessionId;
    const candidate = message.candidate;
    const sdpMid = message.sdpMid;
    const sdpMLineIndex = message.sdpMLineIndex;
    this.broadcast("candidate", {
      sessionId: sessionId,
      candidate: candidate,
      sdpMid: sdpMid,
      sdpMLineIndex: sdpMLineIndex,
    }, {
      except: client
    });
  }

  onDesc(client: Client, message: any) {
    const sessionId = message.sessionId;
    const type = message.type;
    const sdp = message.sdp;
    this.broadcast("desc", {
      sessionId: sessionId,
      type: type,
      sdp: sdp,
    }, {
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
