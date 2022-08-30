// HiringThing Job Embed Widget

(function () {
	// Localize jQuery variable
	var jQuery;

	/******** Our main function ********/

	function main() {
		jQuery(document).ready(function ($) {
			// We can use jQuery here

			// set a default source code
			if (typeof ht_settings.src_code === "undefined" || ht_settings.src_code === null) {
				ht_settings.src_code = "standard";
			}

			if (
				typeof ht_settings.open_jobs_in_new_tab === "undefined" ||
				ht_settings.open_jobs_in_new_tab === null
			) {
				ht_settings.open_jobs_in_new_tab = false;
			}

			var container = $("#hiringthing-jobs");
			var spinner = $('<img src="https://images.applicant-tracking.com/images/loading2.gif" />');
			container.html(spinner);

			var site_url = ht_settings.site_url;
			if (typeof site_url === "string") {
				site_url = [site_url];
			}

			var promises = [];
			$.each(site_url, function (idx, site_url) {
				promises.push(
					$.ajax({
						url:
							"https://" +
							site_url +
							".applicant-tracking.com/api/widget_jobs?src=" +
							ht_settings.src_code +
							"&callback=?",
						type: "GET",
						dataType: "json",
					})
				);
			});

			$.when
				.apply($, promises)
				.done(function (response) {
					var jobs = [];
					if (promises.length == 1) {
						Array.prototype.push.apply(jobs, response);
					} else {
						$.each(arguments, function (idx, response) {
							Array.prototype.push.apply(jobs, response[0]);
						});
					}

					var str = "";
					for (var i = 0; i < jobs.length; i++) {
						ahref_start = '<a href="' + jobs[i].apply_url + '"';
						if (ht_settings.open_jobs_in_new_tab) ahref_start += ' target="_blank" ';

						str += ahref_start;

						str += 'class="ht-title-link">' + jobs[i].title + "</a>";

						if (jobs[i].location) {
							str += '<div class="ht-location">' + jobs[i].location + "</div>";
						}

						str += '<div class="ht-summary">' + jobs[i].summary + "</div>";
						str +=
							ahref_start +
							'aria-label="Apply now to ' +
							jobs[i].title +
							'"' +
							' class="ht-apply-link">Apply Now</a>';
					}

					if (str == "") {
						str = '<div class="ht-no-positions">We have no open positions at this time.</div>';
					}

					container.html(str);
				})
				.fail(function () {
					container.html(
						"Account not found.<br /><br /> Please configure 'site_url' to match your Applicant Tracking account domain. "
					);
				});
		});
	}

	/******** Load jQuery if not present *********/
	if (window.jQuery === undefined || window.jQuery.fn.jquery !== "3.3.1") {
		/******** Called once jQuery has loaded ******/
		var onloadHandler = function () {
			// Restore $ and window.jQuery to their previous values and store the
			// new jQuery in our local jQuery variable
			jQuery = window.jQuery.noConflict(true);
			// Call our main function
			main();
		};
		var script_tag = document.createElement("script");
		script_tag.setAttribute("type", "text/javascript");
		script_tag.setAttribute("src", "https://code.jquery.com/jquery-3.3.1.min.js");
		if (script_tag.readyState) {
			script_tag.onreadystatechange = function () {
				// For old versions of IE
				if (this.readyState === "complete" || this.readyState === "loaded") {
					onloadHandler();
				}
			};
		} else {
			// Other browsers
			script_tag.onload = onloadHandler;
		}
		// Try to find the head, otherwise default to the documentElement
		(document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
	} else {
		// The jQuery version on the window is the one we want to use
		jQuery = window.jQuery;
		main();
	}
})(); // We call our anonymous function immediately