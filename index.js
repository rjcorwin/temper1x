var HID = require('node-hid')
var readCommand = [0x01, 0x80, 0x33, 0x01, 0x00, 0x00, 0x00, 0x00]


exports.getDevices = function() {
  var devices = HID.devices()
  var list = []
  devices.forEach(function(item) {
    if (item.product.substr(0,7) === "TEMPer1" && item.vendorId === 3141) {
      list.push(item.path)
    }
  })
  return list
}


exports.readTemperature = function(path, callback, converter){
  var device = new HID.HID(path)
  if(!converter) {
    converter=exports.toDegreeCelcius
  }
  device.read(function(err,response){
    if(err) {
      console.log(err)
    } else {
      hasRead = true
      callback.call(this,null, converter(response[2],response[3]))
    }
  });
  device.write(readCommand)
}


exports.toDegreeCelcius=function(hiByte, loByte) {
  var sign = hiByte & (1 << 7)
  var temp = ((hiByte & 0x7F) << 8) | loByte
  if (sign) {
    temp = -temp
  }
  return temp * 125.0 / 32000.0
}
