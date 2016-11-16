self.port.on("Call_Page_Init", function ()
{
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.text =

"var _g = null;" +

"window.addEventListener('signText-message-rs', function(event){" +
	"_g = event.detail;" +
"}, false);"+

"window.crypto = window.crypto || {};" +

"window.crypto.signText = function(stringToSign, caOption){" +
	"var event = document.createEvent('CustomEvent');" +
	"event.initCustomEvent('signText-message-rq', true, true, { " +	
		"'stringToSign': stringToSign,"+
		"'caOption': caOption," +
		"'misc':{" +
			"'location': window.location.href," +
			"'hostname': window.location.hostname," +
			"'characterSet': window.document.characterSet," +
		"}," +
	"});" +
	"document.documentElement.dispatchEvent(event);" +

	"alert('wait for certChooser dialog and then close this');" +
	"return _g;" +
"};";

	document.body.appendChild(script);

});


//called from addon-script to content-script
self.port.on("Call_Page_signTextRs", function (sgn)
{
	//call from content-script to page-script
	var event = new CustomEvent("signText-message-rs", { bubbles: true, detail: sgn });
	document.documentElement.dispatchEvent(event);
});



//called from page-script to content-script
window.addEventListener('signText-message-rq', function (event)
{
	//call from content-script to addon-script
	self.port.emit("Call_Addon_signTextRq", event.detail);
}, false);