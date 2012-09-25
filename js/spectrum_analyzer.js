function SpectrumAnalyzer(audio) {
  this.audio = audio;
  this.data = new Array();
  this.delta = new Float32Array(this.audio.bufferSize/8);	
  this.fft = new FFT(this.audio.bufferSize/8, this.sampleRate);
  this.analysis = this.audio.context.createJavaScriptNode(1024);
  var analyzer = this;
  this.analysis.onaudioprocess = function(event) { 
    analyzer.audioReceived(event); 
  };
}

SpectrumAnalyzer.prototype.play = function() {
  var analyzer = this;
  this.audio.play(function() {
    analyzer.audio.connectProcessor(analyzer.analysis);
  });
}

SpectrumAnalyzer.prototype.toggle = function() {
  this.audio.playing ? this.audio.stop() : this.play(); 
};


SpectrumAnalyzer.prototype.audioReceived = function(event) {
  this.audio.routeAudio(event);   
  this.fft.forward(this.audio.mono);
  for ( var i = 0; i < this.fft.spectrum.length; i++ ) {
    amplitude = this.fft.spectrum[i] * 1000;
    this.delta[i] = amplitude - this.data[i];
    this.data[i] = amplitude;
  }
}