
set BOOTSTRAP=.\docs\assets\css\bootstrap.css
set BOOTSTRAP_LESS=.\less\bootstrap.less
set BOOTSTRAP_RESPONSIVE=.\docs\assets\css\bootstrap-responsive.css
set BOOTSTRAP_RESPONSIVE_LESS=.\less\responsive.less

mkdir css
cat js\bootstrap-transition.js js\bootstrap-alert.js js\bootstrap-button.js js\bootstrap-carousel.js js\bootstrap-collapse.js js\bootstrap-dropdown.js js\bootstrap-modal.js js\bootstrap-tooltip.js js\bootstrap-popover.js js\bootstrap-scrollspy.js js\bootstrap-tab.js js\bootstrap-typeahead.js > js\bootstrap.js
lessc %BOOTSTRAP_LESS% > css\bootstrap.css
lessc  %BOOTSTRAP_LESS% > css\bootstrap.min.css -compress
lessc  %BOOTSTRAP_RESPONSIVE_LESS% > css\bootstrap-responsive.css
lessc  %BOOTSTRAP_RESPONSIVE_LESS% > css\bootstrap-responsive.min.css -compress
