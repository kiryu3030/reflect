class AnglePacket {
  id = "";
  horizontal = 0;
  vertical = 0;

  json(){
    return {
      id: this.id,
      horizontal: this.horizontal,
      vertical: this.vertical
    }
  }
}

class SelfStatePacket {
  socketId = "";
  stationId = "";

  json(){
    return {
      socketId: this.socketId,
      stationId: this.stationId
    }
  }
}
