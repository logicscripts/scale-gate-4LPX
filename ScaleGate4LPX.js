// _______________________________________
// ScaleGate4LPX v1.1
//________________________________________
// Created by Attila Enhardt on 2017-04-08
// Copyright codecave / LogicScripts 2017.
//________________________________________
//


var rootSelect = ["C/Am", "C#/Bbm", "D/Bm", "D#/Cm", "E/C#m", "F/Dm", "F#/D#m", "G/Em", "G#/Fm", "A/F#m", "Bb/Gm", "B/G#m"],
    debug = false;

PluginParameters = [];
var heading = new Setting("ScaleGate4LPX by codedave", "text"),
    scales = new Setting("Select scale", "menu", rootSelect),
    gate = new ScaleGate(0);

function HandleMIDI(e) {
    if (e instanceof Note) {
        if (gate.checkNote(e)) {
            e.send();
        }
    } else {
        e.send();
    }
}

function Setting(name, type, values, minva, maxva, defva, nos, unit) {
    this.name = name;
    this.type = type;
    this.valueStrings = values || null;
    this.currentValue = null;
    this.minValue = minva || 0;
    this.maxValue = values != undefined ? values.length - 1 : maxva || 0;
    this.defaultValue = defva || 0;
    this.numberOfSteps = values != undefined ? values.length - 1 : nos || null;
    this.unit = unit || null;
    PluginParameters.push(this);
};

function ParameterChanged(p, v) {
    p ? gate.setRoot(v) : false;
    MIDI.allNotesOff();
}

function ScaleGate(root) {
    this.root = new Root(root);
    this.setRoot = function (r) {
        this.root = new Root(r);
    };
    this.checkNote = (note) => this.root.notes.indexOf(note.pitch) >= 0;
}

function Root(r) {
    isMidi = (v) => v >= 0 && v <= 127;
    this.notes = [0, 2, 4, 5, 7, 9, 11].map((n) => n + r - 12 > -1 ? n + r - 12 : n + r)
        .sort((a, b) => a - b);
    var origList = this.notes.slice(0);
    for (var i = 12; i <= 127; i += 12) {
        this.notes = this.notes.concat(origList.map((c) => c + i).filter(isMidi));
    }
}
