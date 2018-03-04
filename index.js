var Service, Characteristic;
var wol = require('wake_on_lan');
var SamsungTvRemote = require('samsung-tv-remote');


module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory("homebridge-samsung-remote", "SamsungTV", SamsungTV);
};

function SamsungTV(log, config) {
    var accessory = this;
    this.log = log;
    this.config = config;
    this.name = config["name"];
    this.ip = config["ip"];
    this.mac = config["mac"];
    this.type = config["type"] || "power";
    this.app_name = config["app_name"] || "homebridge";
    this.command = config["command"];
    this.channel = config["channel"];
    this.repeat = config["repeat"] || 1;
    this.delay = config["delay"] || 500;



    if (!config.ip) throw new Error("TV IP address is required");
    if (!config.mac) throw new Error("TV MAC address is required");
    
    this.TV = new SamsungTvRemote({
        ip: this.ip
    });

    
    this.timer_off = null;

    this.service = new Service.Switch(this.name);
    this.service
        .getCharacteristic(Characteristic.On)
        .on('get', this._getOn.bind(this))
        .on('set', this._setOn.bind(this));


    if(this.type === 'power') {
        this.service = new Service.Switch(this.name);
        this.service
            .getCharacteristic(Characteristic.On)
            .on('get', this._getOn.bind(this))
            .on('set', this._setOn.bind(this));

    } else if (this.type === 'mute'){
        this.service = new Service.Switch(this.name);

        this.service
            .getCharacteristic(Characteristic.On)
            .on('get', this._getMute.bind(this))
            .on('set', this._setMute.bind(this));

    } else if (this.type === 'channel'){
        this.service = new Service.Switch(this.name);

        this.service
            .getCharacteristic(Characteristic.On)
            .on('get', this._getChannel.bind(this))
            .on('set', this._setChannel.bind(this));

    } else if (this.type === 'custom'){
        this.service = new Service.Switch(this.name);

        this.service
            .getCharacteristic(Characteristic.On)
            .on('get', this._getCustom.bind(this))
            .on('set', this._setCustom.bind(this));
    }
}

SamsungTV.prototype.getInformationService = function() {
    var informationService = new Service.AccessoryInformation();
    informationService
        .setCharacteristic(Characteristic.Name, this.name)
        .setCharacteristic(Characteristic.Manufacturer, 'Samsung TV')
        .setCharacteristic(Characteristic.Model, 'Tizen2016')
        .setCharacteristic(Characteristic.SerialNumber, this.ip);
    return informationService;
};

SamsungTV.prototype.getServices = function() {
    return [this.service, this.getInformationService()];
};


/***********************************************************************************
***********************************   POWER   ************************************** 
/***********************************************************************************/

SamsungTV.prototype._getOn = function(callback) {
    var accessory = this;
    if(accessory.timer_off !== null) {
        accessory.log('Powering OFF is in progress, Reporting OFF');
        callback(null, false);
    } else {
        var alive = false
        accessory.TV.isTvAlive(function(success) {
            if (success) alive = true
        });
        setTimeout(function(){
            if (!alive) {
                accessory.log('TV is OFF');
                callback(null, false);
            } else {
                accessory.log('TV is ON');
                callback(null, true);
            }
        }, 2000)
    }
};

SamsungTV.prototype._setOn = function(on, callback) {
    var accessory = this;
    accessory.log('Setting TV to ' + (on ? "ON" : "OFF"));
    if (on) {
        if(accessory.timer_off !== null) {
            clearTimeout(accessory.timer_off);
            accessory.timer_off = null
            accessory.log('Powering OFF is in progress, Turning ON via \'KEY_POWER\' command');
            accessory.TV.isTvAlive(function(success) {
                if (!success) {
                    accessory.log('Can\'t reach TV, Trying via \'Wake On Lan\'');
                    wol.wake(accessory.mac, function(err) {
                        if (err) {
                            callback(new Error(err));
                        } else {
                            accessory.log('TV successfully powered ON');
                            callback();
                        }
                    });
                } else {
                    accessory.TV.sendKey('KEY_POWER')
                    accessory.log('TV powered ON');
                    callback();
                }
            });
        } else {
            var alive = false
            accessory.TV.isTvAlive(function(success) {
                if (success) alive = true
            });
            setTimeout(function(){
                if (!alive) {
                    wol.wake(accessory.mac, function(err) {
                        if (err) {
                            callback(new Error(err));
                        } else {
                            accessory.log('TV successfully powered ON');
                            callback();
                        }
                    });
                } else {
                    accessory.log('TV is already ON');
                    callback();
                }
            }, 1000)
        }
    } else {
        if(accessory.timer_off !== null) {
            accessory.log('Powering OFF is already in progress');
            callback();
        } else {
            accessory.TV.isTvAlive(function(success) {
                if (!success) {
                    accessory.log('TV is already OFF');
                    callback();
                } else {
                    accessory.TV.sendKey('KEY_POWER')
                    accessory.timer_off = setTimeout(function(){
                        accessory.timer_off = null;
                    },3000)
                    accessory.log('TV powered OFF');
                    callback();
                }
            });
        }
    }
};


/***********************************************************************************
************************************   MUTE   ************************************** 
/***********************************************************************************/
SamsungTV.prototype._getMute = function(callback) {
  callback(null, false);
};

SamsungTV.prototype._setMute = function(mute, callback) {
    var accessory = this;

    accessory.log('Sending mute command to TV');
    accessory.TV.isTvAlive(function(success) {
        if (!success) {
            accessory.log('TV is OFF');
            callback();
        } else {
            accessory.TV.sendKey('KEY_MUTE');
            accessory.log('Mute command sent successfully');
            callback();
        }
    });
    setTimeout(function(){
        accessory.service.getCharacteristic(Characteristic.On).updateValue(false)
    }, 1000)
};


/***********************************************************************************
************************************   CHANNEL   ************************************ 
/***********************************************************************************/

SamsungTV.prototype._getChannel = function(callback) {
    callback(null, false);
  };
  
SamsungTV.prototype._setChannel = function(state, callback) {
    var accessory = this;
    var channel = accessory.channel.toString()
    accessory.log('Setting Channel ' + channel + ' on TV');
    accessory.TV.isTvAlive(function(success) {
        if (!success) {
            accessory.log('TV is OFF');
            callback();
        } else {
            accessory.TV.sendKey('KEY_CHUP');
            var i=0;
            setTimeout(function(){
                var intervalCommands = setInterval(function(){
                    if (i < channel.length){
                        accessory.TV.sendKey('KEY_' + channel.charAt(i))
                        i++
                    } else {
                        clearInterval(intervalCommands)
                        accessory.TV.sendKey('KEY_ENTER');
                        accessory.log('Channel' + channel + ' is set');
                    }
                }, 1000)
            },1500)
            callback();
        }
    });
    setTimeout(function(){
        accessory.service.getCharacteristic(Characteristic.On).updateValue(false)
    }, 3000)
};

/***********************************************************************************
************************************   CUSTOM   *********************************** 
/***********************************************************************************/

SamsungTV.prototype._getCustom = function(callback) {
    callback(null, false);
  };
  
SamsungTV.prototype._setCustom = function(state, callback) {
    var accessory = this;

    accessory.log('Sending ' + accessory.command + ' command to TV');
    accessory.TV.isTvAlive(function(success) {
        if (!success) {
            accessory.log('TV is OFF');
            
            callback();
        } else {
            accessory.TV.sendKey(accessory.command)
            accessory.log(accessory.command + ' command sent');
            callback();
            var counter = 1;
            var repeatSend = setInterval(function(){
                if (counter < accessory.repeat){
                    accessory.TV.sendKey(accessory.command)
                    counter++
                } else {
                    clearInterval(repeatSend)
                }
            }, accessory.delay)
        }
    });
    setTimeout(function(){
        accessory.service.getCharacteristic(Characteristic.On).updateValue(false)
    }, 1000)
};


