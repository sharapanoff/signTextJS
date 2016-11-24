/*****************************************************************************
PageMod_ContentScriptFile
	this content-script is included in every page
*****************************************************************************/



/*****************************************************************************
page-script to be injected
	create function window.crypto.signText, which will send message to content-script
	add EventListener to receive result message from the content-script
*****************************************************************************/
//----------------------------------------------------------------------------
//--- BEGIN PAGE-SCRIPT ------------------------------------------------------
var strScript =
"var fn_signTextOnResolve = null;" +


"window.addEventListener('signText_msg_ContentReturnsSignTextResult', function(event){" +
	"fn_signTextOnResolve(event.detail);" +
"}, false);" +


"window.crypto = window.crypto || {};" +


"window.crypto.signTextAsync = function(stringToSign, caOption){" +
	"var event = document.createEvent('CustomEvent');" +
	"event.initCustomEvent('signText_msg_PageCallsSignText', true, true, { " +
		"'stringToSign': stringToSign," +
		"'caOption': caOption," +
		"'misc':{" +
			"'location': window.location.href," +
			"'hostname': window.location.hostname," +
			"'characterSet': window.document.characterSet," +
		"}," +
	"});" +

	"var p = new Promise(" +
		"function(resolve, reject) {" +
			"document.documentElement.dispatchEvent(event);" +
			"fn_signTextOnResolve=resolve;" +
	"});" +
	"return p;" +
"};" +


"window.crypto.signText = function(stringToSign, caOption){" +
	"var res = null;"+
	"var p = window.crypto.signTextAsync(stringToSign, caOption);" +
	"p.then(function(val){res = val;});"+

	//just block the main thred
	"alert('wait for certChooser dialog and then close this');" +

	"return res;" +
"};" +


"";
//--- END PAGE-SCRIPT --------------------------------------------------------
//----------------------------------------------------------------------------



/*****************************************************************************
receive INIT message from addon-script
will inject page-script
*****************************************************************************/
self.port.on("signText_msg_InitContentScript", function ()
{
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.text = strScript;
	document.body.appendChild(script);

});



/*****************************************************************************
receive message from addon-script
will send message to page-script
*****************************************************************************/
self.port.on("signText_msg_AddonReturnsSignTextResult", function (sgn)
{
	var event = new CustomEvent("signText_msg_ContentReturnsSignTextResult", { bubbles: true, detail: sgn });
	document.documentElement.dispatchEvent(event);
});



/*****************************************************************************
receive message from page-script
will send message to addon-script
*****************************************************************************/
window.addEventListener('signText_msg_PageCallsSignText', function (event)
{
	self.port.emit("signText_msg_ContentCallsSignText", event.detail);
}, false);