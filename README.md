# homebridge-samsung-remote

[Homebridge](https://github.com/nfarina/homebridge) plugin for Samsung TVs (2016 and newer) running Tizen Operating systems (Smart Hub).

This plugin allows you to control your Samsung TV with HomeKit and Siri.

_________________________________________
#### Creating and maintaining Homebridge plugins consume a lot of time and effort, if you would like to share your appreciation, feel free to "Star" or donate. 

<a target="blank" href="https://www.paypal.me/nitaybz"><img src="https://img.shields.io/badge/Donate-PayPal-blue.svg"/></a>
<a target="blank" href="https://blockchain.info/payment_request?address=18uuUZ5GaMFoRH5TrQFJATQgqrpXCtqZRQ"><img src="https://img.shields.io/badge/Donate-Bitcoin-green.svg"/></a>

[Click here](https://github.com/nitaybz?utf8=%E2%9C%93&tab=repositories&q=homebridge) to review more of my plugins.
_________________________________________

## Installation
1. Install homebridge using: `sudo npm install -g --unsafe-perm homebridge`
2. Install this plugin using: `sudo npm install -g homebridge-samsung-remote`
3. Update your configuration file. See `config-sample.json`.

### Config Sample:

```
"accessories": [
    {
        "accessory": "SamsungTV",
        "name": "Living Room TV",
        "ip": "10.0.0.0",
        "mac": "12:34:45:AB:CD:EF",
        "type": "power"
    },
    {
        "accessory": "SamsungTV",
        "name": "Mute TV",
        "ip": "10.0.0.0",
        "mac": "12:34:45:AB:CD:EF",
        "type": "mute"
    },
    {
        "accessory": "SamsungTV",
        "name": "Channel 13",
        "ip": "10.0.0.0",
        "mac": "12:34:45:AB:CD:EF",
        "type": "channel",
        "channel": "13"
    },
    {
        "accessory": "SamsungTV",
        "name": "Change HDMI",
        "ip": "10.0.0.0",
        "mac": "12:34:45:AB:CD:EF",
        "type": "custom",
        "command": "KEY_HDMI"
    }
]
```

## Configurations
|    Parameter        |                     Description                                | Required |  Default  |
| ------------------- | -------------------------------------------------------------- |:--------:|:---------:|
| `accessory`         | always "SamsungTV"                                             |     ✓    |      -    |
| `name`              | name of the accessory in Homekit                               |     ✓    |      -    |
| `ip`                | the IP address of your Samsung TV                              |     ✓    |      -    |
| `mac`               | the mac address of your Samsung TV (Required for wake on lan)  |     ✓    |      -    |
| `type`              | type of accessory - power / mute / channel / custom            |          |  "power"  |
| `channel`           | channel on TV you want to switch to (only 1 channel per switch)| only for type "channel" |      -    |
| `command`           | custom command to send to TV (List of commands at the bottom)  | only for type "custom"   |      -    |


## Important Notes
1. The TV API does not work when the TV is powered down, so in order to turn on TV, the plugin will send wake-on-lan command over ethernet, which means that LAN cable should always be connected to TV (or else ON command will not work).

2. All switches (other than type "power") are stateless switches, which means that there is no OFF command. turning ON the switch will send the command and then turn the switch OFF.

3. Don't expect all "custom" commands to work with your TV. In fact, most of them are not working for me, but I found some of them are very usefull. I guess it's best for each of you to test some commands with your own TV to see what works.

4. The Channel type was done according to my own TV model (KU7000) - send "Channel Up" command to switch to TV, channel numbers, and "Enter" command (3 digits max). The commands are sent one after the other with a reasonable delay, if you're experiencing any mailfunctions I would suggest to start with playing with the custom accessory and see what's working for you, than you can open an issue with the problem and the way you think your tv should act (if you got it from testing the custom switch)

## Commands List
```
KEY_MENU
KEY_UP
KEY_DOWN
KEY_LEFT
KEY_RIGHT
KEY_3
KEY_VOLUP
KEY_4
KEY_5
KEY_6
KEY_VOLDOWN
KEY_7
KEY_8
KEY_9
KEY_MUTE
KEY_CHDOWN
KEY_0
KEY_CHUP
KEY_PRECH
KEY_GREEN
KEY_YELLOW
KEY_CYAN
KEY_ADDDEL
KEY_SOURCE
KEY_INFO
KEY_PIP_ONOFF
KEY_PIP_SWAP
KEY_PLUS100
KEY_CAPTION
KEY_PMODE
KEY_TTX_MIX
KEY_TV
KEY_PICTURE_SIZE
KEY_AD
KEY_PIP_SIZE
KEY_MAGIC_CHANNEL
KEY_PIP_SCAN
KEY_PIP_CHUP
KEY_PIP_CHDOWN
KEY_DEVICE_CONNECT
KEY_HELP
KEY_ANTENA
KEY_CONVERGENCE
KEY_11
KEY_12
KEY_AUTO_PROGRAM
KEY_FACTORY
KEY_3SPEED
KEY_RSURF
KEY_ASPECT
KEY_TOPMENU
KEY_GAME
KEY_QUICK_REPLAY
KEY_STILL_PICTURE
KEY_DTV
KEY_FAVCH
KEY_REWIND
KEY_STOP
KEY_PLAY
KEY_FF
KEY_REC
KEY_PAUSE
KEY_TOOLS
KEY_INSTANT_REPLAY
KEY_LINK
KEY_FF_
KEY_GUIDE
KEY_REWIND_
KEY_ANGLE
KEY_RESERVED1
KEY_ZOOM1
KEY_PROGRAM
KEY_BOOKMARK
KEY_DISC_MENU
KEY_PRINT
KEY_RETURN
KEY_SUB_TITLE
KEY_CLEAR
KEY_VCHIP
KEY_REPEAT
KEY_DOOR
KEY_OPEN
KEY_WHEEL_LEFT
KEY_POWER
KEY_SLEEP
KEY_2
KEY_DMA
KEY_TURBO
KEY_1
KEY_FM_RADIO
KEY_DVR_MENU
KEY_MTS
KEY_PCMODE
KEY_TTX_SUBFACE
KEY_CH_LIST
KEY_RED
KEY_DNIe
KEY_SRS
KEY_CONVERT_AUDIO_MAINSUB
KEY_MDC
KEY_SEFFECT
KEY_DVR
KEY_DTV_SIGNAL
KEY_LIVE
KEY_PERPECT_FOCUS
KEY_HOME
KEY_ESAVING
KEY_WHEEL_RIGHT
KEY_CONTENTS
KEY_VCR_MODE
KEY_CATV_MODE
KEY_DSS_MODE
KEY_TV_MODE
KEY_DVD_MODE
KEY_STB_MODE
KEY_CALLER_ID
KEY_SCALE
KEY_ZOOM_MOVE
KEY_CLOCK_DISPLAY
KEY_AV1
KEY_SVIDEO1
KEY_COMPONENT1
KEY_SETUP_CLOCK_TIMER
KEY_COMPONENT2
KEY_MAGIC_BRIGHT
KEY_DVI
KEY_HDMI
KEY_W_LINK
KEY_DTV_LINK
KEY_APP_LIST
KEY_BACK_MHP
KEY_ALT_MHP
KEY_DNSe
KEY_RSS
KEY_ENTERTAINMENT
KEY_ID_INPUT
KEY_ID_SETUP
KEY_ANYNET
KEY_POWEROFF
KEY_POWERON
KEY_ANYVIEW
KEY_MS
KEY_MORE
KEY_PANNEL_POWER
KEY_PANNEL_CHUP
KEY_PANNEL_CHDOWN
KEY_PANNEL_VOLUP
KEY_PANNEL_VOLDOW
KEY_PANNEL_ENTER
KEY_PANNEL_MENU
KEY_PANNEL_SOURCE
KEY_AV2
KEY_AV3
KEY_SVIDEO2
KEY_SVIDEO3
KEY_ZOOM2
KEY_PANORAMA
KEY_4_3
KEY_16_9
KEY_DYNAMIC
KEY_STANDARD
KEY_MOVIE1
KEY_CUSTOM
KEY_AUTO_ARC_RESET
KEY_AUTO_ARC_LNA_ON
KEY_AUTO_ARC_LNA_OFF
KEY_AUTO_ARC_ANYNET_MODE_OK
KEY_AUTO_ARC_ANYNET_AUTO_START
KEY_AUTO_FORMAT
KEY_DNET
KEY_HDMI1
KEY_AUTO_ARC_CAPTION_ON
KEY_AUTO_ARC_CAPTION_OFF
KEY_AUTO_ARC_PIP_DOUBLE
KEY_AUTO_ARC_PIP_LARGE
KEY_AUTO_ARC_PIP_SMALL
KEY_AUTO_ARC_PIP_WIDE
KEY_AUTO_ARC_PIP_LEFT_TOP
KEY_AUTO_ARC_PIP_RIGHT_TOP
KEY_AUTO_ARC_PIP_LEFT_BOTTOM
KEY_AUTO_ARC_PIP_RIGHT_BOTTOM
KEY_AUTO_ARC_PIP_CH_CHANGE
KEY_AUTO_ARC_AUTOCOLOR_SUCCESS
KEY_AUTO_ARC_AUTOCOLOR_FAIL
KEY_AUTO_ARC_C_FORCE_AGING
KEY_AUTO_ARC_USBJACK_INSPECT
KEY_AUTO_ARC_JACK_IDENT
KEY_NINE_SEPERATE
KEY_ZOOM_IN
KEY_ZOOM_OUT
KEY_MIC
KEY_HDMI2
KEY_HDMI3
KEY_AUTO_ARC_CAPTION_KOR
KEY_AUTO_ARC_CAPTION_ENG
KEY_AUTO_ARC_PIP_SOURCE_CHANGE
KEY_HDMI4
KEY_AUTO_ARC_ANTENNA_AIR
KEY_AUTO_ARC_ANTENNA_CABLE
KEY_AUTO_ARC_ANTENNA_SATELLITE
KEY_EXT1
KEY_EXT2
KEY_EXT3
KEY_EXT4
KEY_EXT5
KEY_EXT6
KEY_EXT7
KEY_EXT8
KEY_EXT9
KEY_EXT10
KEY_EXT11
KEY_EXT12
KEY_EXT13
KEY_EXT14
KEY_EXT15
KEY_EXT16
KEY_EXT17
KEY_EXT18
KEY_EXT19
KEY_EXT20
KEY_EXT21
KEY_EXT22
KEY_EXT23
KEY_EXT24
KEY_EXT25
KEY_EXT26
KEY_EXT27
KEY_EXT28
KEY_EXT29
KEY_EXT30
KEY_EXT31
KEY_EXT32
KEY_EXT33
KEY_EXT34
KEY_EXT35
KEY_EXT36
KEY_EXT37
KEY_EXT38
KEY_EXT39
KEY_EXT40
KEY_EXT41
```

## Credits

This plugin was inspired by @dragouf fork [homebridge-samsungsmarttv](https://github.com/dragouf/homebridge-samsungsmarttv)
and the original plugin  [homebridge-samsungtv2016](https://github.com/kyleaa/homebridge-samsungtv2016) by @kyleaa
