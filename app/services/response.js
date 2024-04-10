class response {
  /**
   * api response.
   * @param {number} id 
   * @param {string} msg 
   */
  constructor(id, msg) {
    this.id = id;
    this.msg = msg;
  }

  json(){
    return {
      id: this.id,
      msg: this.msg
    }
  }
}

export default response;
