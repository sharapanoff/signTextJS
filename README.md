signTextJsPlus (fix e10s)
===============

re-implements window.crypto.signText and exposes it to content

Why signTextJsPlus (fix e10s)?
--------------------
the source code is 
[here](https://github.com/sharapanoff/signTextJS/tree/signTextJsPlus_fix_v50)
it is a branch of 
[signTextJsPlus](https://github.com/jasp00/signTextJS), 
which is a branch of 
[signTextJs](https://github.com/mozkeeler/signTextJS) addon.

due to removal of API getUsagesString from nsIX509Cert these addons were not working in ff50
see bug
[1309690](https://bugzilla.mozilla.org/show_bug.cgi?id=1309690)

due to Electrolysis these addons were not working in ff52, when Enable multi-process in ON


