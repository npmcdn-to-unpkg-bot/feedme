// Contact Form Scripts

$(function() {

    $("#contactFrom input,#contactForm textarea").jqBootstrapValidation({
        preventSubmit: true,
        submitError: function($form, event, errors) {
            // additional error messages or events
        },
        submitSuccess: function($form, event) {
            event.preventDefault(); // prevent default submit behaviour
            // get values from FORM
            var name = $("input#name").val();
            var email = $("input#email").val();
            var phone = $("input#phone").val();
            var message = $("textarea#message").val();
            var firstName = name; // For Success/Failure Message
            // Check for white space in name for Success/Fail message
            if (firstName.indexOf(' ') >= 0) {
                firstName = name.split(' ').slice(0, -1).join(' ');
            }
            $.ajax({
                url: "././mail/contact_me.php",
                type: "POST",
                data: {
                    name: name,
                    phone: phone,
                    email: email,
                    message: message
                },
                cache: false,
                success: function() {
                    // Success message
                    $('#success').html("<div class='alert alert-success'>");
                    $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                        .append("</button>");
                    $('#success > .alert-success')
                        .append("<strong>Your message has been sent. </strong>");
                    $('#success > .alert-success')
                        .append('</div>');

                    //clear all fields
                    $('#contactForm').trigger("reset");
                },
                error: function() {
                    // Fail message
                    $('#success').html("<div class='alert alert-danger'>");
                    $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                        .append("</button>");
                    $('#success > .alert-danger').append("<strong>Sorry " + firstName + ", it seems that my mail server is not responding. Please try again later!");
                    $('#success > .alert-danger').append('</div>');
                    //clear all fields
                    $('#contactForm').trigger("reset");
                },
            })
        },
        filter: function() {
            return $(this).is(":visible");
        },
    });

    $("a[data-toggle=\"tab\"]").click(function(e) {
        e.preventDefault();
        $(this).tab("show");
    });
});


/*When clicking on Full hide fail/success boxes */
$('#name').focus(function() {
    $('#success').html('');
});

 // jqBootstrapValidation
 // * A plugin for automating validation on Twitter Bootstrap formatted forms.
 // *
 // * v1.3.6
 // *
 // * License: MIT <http://opensource.org/licenses/mit-license.php> - see LICENSE file
 // *
 // * http://ReactiveRaven.github.com/jqBootstrapValidation/
 

(function( $ ){

	var createdElements = [];

	var defaults = {
		options: {
			prependExistingHelpBlock: false,
			sniffHtml: true, // sniff for 'required', 'maxlength', etc
			preventSubmit: true, // stop the form submit event from firing if validation fails
			submitError: false, // function called if there is an error when trying to submit
			submitSuccess: false, // function called just before a successful submit event is sent to the server
            semanticallyStrict: false, // set to true to tidy up generated HTML output
			autoAdd: {
				helpBlocks: true
			},
            filter: function () {
                // return $(this).is(":visible"); // only validate elements you can see
                return true; // validate everything
            }
		},
    methods: {
      init : function( options ) {

        var settings = $.extend(true, {}, defaults);

        settings.options = $.extend(true, settings.options, options);

        var $siblingElements = this;

        var uniqueForms = $.unique(
          $siblingElements.map( function () {
            return $(this).parents("form")[0];
          }).toArray()
        );

        $(uniqueForms).bind("submit", function (e) {
          var $form = $(this);
          var warningsFound = 0;
          var $inputs = $form.find("input,textarea,select").not("[type=submit],[type=image]").filter(settings.options.filter);
          $inputs.trigger("submit.validation").trigger("validationLostFocus.validation");

          $inputs.each(function (i, el) {
            var $this = $(el),
              $controlGroup = $this.parents(".form-group").first();
            if (
              $controlGroup.hasClass("warning")
            ) {
              $controlGroup.removeClass("warning").addClass("error");
              warningsFound++;
            }
          });

          $inputs.trigger("validationLostFocus.validation");

          if (warningsFound) {
            if (settings.options.preventSubmit) {
              e.preventDefault();
            }
            $form.addClass("error");
            if ($.isFunction(settings.options.submitError)) {
              settings.options.submitError($form, e, $inputs.jqBootstrapValidation("collectErrors", true));
            }
          } else {
            $form.removeClass("error");
            if ($.isFunction(settings.options.submitSuccess)) {
              settings.options.submitSuccess($form, e);
            }
          }
        });

        return this.each(function(){

          // Get references to everything we're interested in
          var $this = $(this),
            $controlGroup = $this.parents(".form-group").first(),
            $helpBlock = $controlGroup.find(".help-block").first(),
            $form = $this.parents("form").first(),
            validatorNames = [];

          // create message container if not exists
          if (!$helpBlock.length && settings.options.autoAdd && settings.options.autoAdd.helpBlocks) {
              $helpBlock = $('<div class="help-block" />');
              $controlGroup.find('.controls').append($helpBlock);
							createdElements.push($helpBlock[0]);
          }

          // =============================================================
          //                                     SNIFF HTML FOR VALIDATORS
          // =============================================================

          // *snort sniff snuffle*

          if (settings.options.sniffHtml) {
            var message = "";
            // ---------------------------------------------------------
            //                                                   PATTERN
            // ---------------------------------------------------------
            if ($this.attr("pattern") !== undefined) {
              message = "Not in the expected format<!-- data-validation-pattern-message to override -->";
              if ($this.data("validationPatternMessage")) {
                message = $this.data("validationPatternMessage");
              }
              $this.data("validationPatternMessage", message);
              $this.data("validationPatternRegex", $this.attr("pattern"));
            }
            // ---------------------------------------------------------
            //                                                       MAX
            // ---------------------------------------------------------
            if ($this.attr("max") !== undefined || $this.attr("aria-valuemax") !== undefined) {
              var max = ($this.attr("max") !== undefined ? $this.attr("max") : $this.attr("aria-valuemax"));
              message = "Too high: Maximum of '" + max + "'<!-- data-validation-max-message to override -->";
              if ($this.data("validationMaxMessage")) {
                message = $this.data("validationMaxMessage");
              }
              $this.data("validationMaxMessage", message);
              $this.data("validationMaxMax", max);
            }
            // ---------------------------------------------------------
            //                                                       MIN
            // ---------------------------------------------------------
            if ($this.attr("min") !== undefined || $this.attr("aria-valuemin") !== undefined) {
              var min = ($this.attr("min") !== undefined ? $this.attr("min") : $this.attr("aria-valuemin"));
              message = "Too low: Minimum of '" + min + "'<!-- data-validation-min-message to override -->";
              if ($this.data("validationMinMessage")) {
                message = $this.data("validationMinMessage");
              }
              $this.data("validationMinMessage", message);
              $this.data("validationMinMin", min);
            }
            // ---------------------------------------------------------
            //                                                 MAXLENGTH
            // ---------------------------------------------------------
            if ($this.attr("maxlength") !== undefined) {
              message = "Too long: Maximum of '" + $this.attr("maxlength") + "' characters<!-- data-validation-maxlength-message to override -->";
              if ($this.data("validationMaxlengthMessage")) {
                message = $this.data("validationMaxlengthMessage");
              }
              $this.data("validationMaxlengthMessage", message);
              $this.data("validationMaxlengthMaxlength", $this.attr("maxlength"));
            }
            // ---------------------------------------------------------
            //                                                 MINLENGTH
            // ---------------------------------------------------------
            if ($this.attr("minlength") !== undefined) {
              message = "Too short: Minimum of '" + $this.attr("minlength") + "' characters<!-- data-validation-minlength-message to override -->";
              if ($this.data("validationMinlengthMessage")) {
                message = $this.data("validationMinlengthMessage");
              }
              $this.data("validationMinlengthMessage", message);
              $this.data("validationMinlengthMinlength", $this.attr("minlength"));
            }
            // ---------------------------------------------------------
            //                                                  REQUIRED
            // ---------------------------------------------------------
            if ($this.attr("required") !== undefined || $this.attr("aria-required") !== undefined) {
              message = settings.builtInValidators.required.message;
              if ($this.data("validationRequiredMessage")) {
                message = $this.data("validationRequiredMessage");
              }
              $this.data("validationRequiredMessage", message);
            }
            // ---------------------------------------------------------
            //                                                    NUMBER
            // ---------------------------------------------------------
            if ($this.attr("type") !== undefined && $this.attr("type").toLowerCase() === "number") {
              message = settings.builtInValidators.number.message;
              if ($this.data("validationNumberMessage")) {
                message = $this.data("validationNumberMessage");
              }
              $this.data("validationNumberMessage", message);
            }
            // ---------------------------------------------------------
            //                                                     EMAIL
            // ---------------------------------------------------------
            if ($this.attr("type") !== undefined && $this.attr("type").toLowerCase() === "email") {
              message = "Not a valid email address<!-- data-validator-validemail-message to override -->";
              if ($this.data("validationValidemailMessage")) {
                message = $this.data("validationValidemailMessage");
              } else if ($this.data("validationEmailMessage")) {
                message = $this.data("validationEmailMessage");
              }
              $this.data("validationValidemailMessage", message);
            }
            // ---------------------------------------------------------
            //                                                MINCHECKED
            // ---------------------------------------------------------
            if ($this.attr("minchecked") !== undefined) {
              message = "Not enough options checked; Minimum of '" + $this.attr("minchecked") + "' required<!-- data-validation-minchecked-message to override -->";
              if ($this.data("validationMincheckedMessage")) {
                message = $this.data("validationMincheckedMessage");
              }
              $this.data("validationMincheckedMessage", message);
              $this.data("validationMincheckedMinchecked", $this.attr("minchecked"));
            }
            // ---------------------------------------------------------
            //                                                MAXCHECKED
            // ---------------------------------------------------------
            if ($this.attr("maxchecked") !== undefined) {
              message = "Too many options checked; Maximum of '" + $this.attr("maxchecked") + "' required<!-- data-validation-maxchecked-message to override -->";
              if ($this.data("validationMaxcheckedMessage")) {
                message = $this.data("validationMaxcheckedMessage");
              }
              $this.data("validationMaxcheckedMessage", message);
              $this.data("validationMaxcheckedMaxchecked", $this.attr("maxchecked"));
            }
          }

          // =============================================================
          //                                       COLLECT VALIDATOR NAMES
          // =============================================================

          // Get named validators
          if ($this.data("validation") !== undefined) {
            validatorNames = $this.data("validation").split(",");
          }

          // Get extra ones defined on the element's data attributes
          $.each($this.data(), function (i, el) {
            var parts = i.replace(/([A-Z])/g, ",$1").split(",");
            if (parts[0] === "validation" && parts[1]) {
              validatorNames.push(parts[1]);
            }
          });

          // =============================================================
          //                                     NORMALISE VALIDATOR NAMES
          // =============================================================

          var validatorNamesToInspect = validatorNames;
          var newValidatorNamesToInspect = [];

          do // repeatedly expand 'shortcut' validators into their real validators
          {
            // Uppercase only the first letter of each name
            $.each(validatorNames, function (i, el) {
              validatorNames[i] = formatValidatorName(el);
            });

            // Remove duplicate validator names
            validatorNames = $.unique(validatorNames);

            // Pull out the new validator names from each shortcut
            newValidatorNamesToInspect = [];
            $.each(validatorNamesToInspect, function(i, el) {
              if ($this.data("validation" + el + "Shortcut") !== undefined) {
                // Are these custom validators?
                // Pull them out!
                $.each($this.data("validation" + el + "Shortcut").split(","), function(i2, el2) {
                  newValidatorNamesToInspect.push(el2);
                });
              } else if (settings.builtInValidators[el.toLowerCase()]) {
                // Is this a recognised built-in?
                // Pull it out!
                var validator = settings.builtInValidators[el.toLowerCase()];
                if (validator.type.toLowerCase() === "shortcut") {
                  $.each(validator.shortcut.split(","), function (i, el) {
                    el = formatValidatorName(el);
                    newValidatorNamesToInspect.push(el);
                    validatorNames.push(el);
                  });
                }
              }
            });

            validatorNamesToInspect = newValidatorNamesToInspect;

          } while (validatorNamesToInspect.length > 0)

          // =============================================================
          //                                       SET UP VALIDATOR ARRAYS
          // =============================================================

          var validators = {};

          $.each(validatorNames, function (i, el) {
            // Set up the 'override' message
            var message = $this.data("validation" + el + "Message");
            var hasOverrideMessage = (message !== undefined);
            var foundValidator = false;
            message =
              (
                message
                  ? message
                  : "'" + el + "' validation failed <!-- Add attribute 'data-validation-" + el.toLowerCase() + "-message' to input to change this message -->"
              )
            ;

            $.each(
              settings.validatorTypes,
              function (validatorType, validatorTemplate) {
                if (validators[validatorType] === undefined) {
                  validators[validatorType] = [];
                }
                if (!foundValidator && $this.data("validation" + el + formatValidatorName(validatorTemplate.name)) !== undefined) {
                  validators[validatorType].push(
                    $.extend(
                      true,
                      {
                        name: formatValidatorName(validatorTemplate.name),
                        message: message
                      },
                      validatorTemplate.init($this, el)
                    )
                  );
                  foundValidator = true;
                }
              }
            );

            if (!foundValidator && settings.builtInValidators[el.toLowerCase()]) {

              var validator = $.extend(true, {}, settings.builtInValidators[el.toLowerCase()]);
              if (hasOverrideMessage) {
                validator.message = message;
              }
              var validatorType = validator.type.toLowerCase();

              if (validatorType === "shortcut") {
                foundValidator = true;
              } else {
                $.each(
                  settings.validatorTypes,
                  function (validatorTemplateType, validatorTemplate) {
                    if (validators[validatorTemplateType] === undefined) {
                      validators[validatorTemplateType] = [];
                    }
                    if (!foundValidator && validatorType === validatorTemplateType.toLowerCase()) {
                      $this.data("validation" + el + formatValidatorName(validatorTemplate.name), validator[validatorTemplate.name.toLowerCase()]);
                      validators[validatorType].push(
                        $.extend(
                          validator,
                          validatorTemplate.init($this, el)
                        )
                      );
                      foundValidator = true;
                    }
                  }
                );
              }
            }

            if (! foundValidator) {
              $.error("Cannot find validation info for '" + el + "'");
            }
          });

          // =============================================================
          //                                         STORE FALLBACK VALUES
          // =============================================================

          $helpBlock.data(
            "original-contents",
            (
              $helpBlock.data("original-contents")
                ? $helpBlock.data("original-contents")
                : $helpBlock.html()
            )
          );

          $helpBlock.data(
            "original-role",
            (
              $helpBlock.data("original-role")
                ? $helpBlock.data("original-role")
                : $helpBlock.attr("role")
            )
          );

          $controlGroup.data(
            "original-classes",
            (
              $controlGroup.data("original-clases")
                ? $controlGroup.data("original-classes")
                : $controlGroup.attr("class")
            )
          );

          $this.data(
            "original-aria-invalid",
            (
              $this.data("original-aria-invalid")
                ? $this.data("original-aria-invalid")
                : $this.attr("aria-invalid")
            )
          );

          // =============================================================
          //                                                    VALIDATION
          // =============================================================

          $this.bind(
            "validation.validation",
            function (event, params) {

              var value = getValue($this);

              // Get a list of the errors to apply
              var errorsFound = [];

              $.each(validators, function (validatorType, validatorTypeArray) {
                if (value || value.length || (params && params.includeEmpty) || (!!settings.validatorTypes[validatorType].blockSubmit && params && !!params.submitting)) {
                  $.each(validatorTypeArray, function (i, validator) {
                    if (settings.validatorTypes[validatorType].validate($this, value, validator)) {
                      errorsFound.push(validator.message);
                    }
                  });
                }
              });

              return errorsFound;
            }
          );

          $this.bind(
            "getValidators.validation",
            function () {
              return validators;
            }
          );

          // =============================================================
          //                                             WATCH FOR CHANGES
          // =============================================================
          $this.bind(
            "submit.validation",
            function () {
              return $this.triggerHandler("change.validation", {submitting: true});
            }
          );
          $this.bind(
            [
              "keyup",
              "focus",
              "blur",
              "click",
              "keydown",
              "keypress",
              "change"
            ].join(".validation ") + ".validation",
            function (e, params) {

              var value = getValue($this);

              var errorsFound = [];

              $controlGroup.find("input,textarea,select").each(function (i, el) {
                var oldCount = errorsFound.length;
                $.each($(el).triggerHandler("validation.validation", params), function (j, message) {
                  errorsFound.push(message);
                });
                if (errorsFound.length > oldCount) {
                  $(el).attr("aria-invalid", "true");
                } else {
                  var original = $this.data("original-aria-invalid");
                  $(el).attr("aria-invalid", (original !== undefined ? original : false));
                }
              });

              $form.find("input,select,textarea").not($this).not("[name=\"" + $this.attr("name") + "\"]").trigger("validationLostFocus.validation");

              errorsFound = $.unique(errorsFound.sort());

              // Were there any errors?
              if (errorsFound.length) {
                // Better flag it up as a warning.
                $controlGroup.removeClass("success error").addClass("warning");

                // How many errors did we find?
                if (settings.options.semanticallyStrict && errorsFound.length === 1) {
                  // Only one? Being strict? Just output it.
                  $helpBlock.html(errorsFound[0] + 
                    ( settings.options.prependExistingHelpBlock ? $helpBlock.data("original-contents") : "" ));
                } else {
                  // Multiple? Being sloppy? Glue them together into an UL.
                  $helpBlock.html("<ul role=\"alert\"><li>" + errorsFound.join("</li><li>") + "</li></ul>" +
                    ( settings.options.prependExistingHelpBlock ? $helpBlock.data("original-contents") : "" ));
                }
              } else {
                $controlGroup.removeClass("warning error success");
                if (value.length > 0) {
                  $controlGroup.addClass("success");
                }
                $helpBlock.html($helpBlock.data("original-contents"));
              }

              if (e.type === "blur") {
                $controlGroup.removeClass("success");
              }
            }
          );
          $this.bind("validationLostFocus.validation", function () {
            $controlGroup.removeClass("success");
          });
        });
      },
      destroy : function( ) {

        return this.each(
          function() {

            var
              $this = $(this),
              $controlGroup = $this.parents(".form-group").first(),
              $helpBlock = $controlGroup.find(".help-block").first();

            // remove our events
            $this.unbind('.validation'); // events are namespaced.
            // reset help text
            $helpBlock.html($helpBlock.data("original-contents"));
            // reset classes
            $controlGroup.attr("class", $controlGroup.data("original-classes"));
            // reset aria
            $this.attr("aria-invalid", $this.data("original-aria-invalid"));
            // reset role
            $helpBlock.attr("role", $this.data("original-role"));
						// remove all elements we created
						if (createdElements.indexOf($helpBlock[0]) > -1) {
							$helpBlock.remove();
						}

          }
        );

      },
      collectErrors : function(includeEmpty) {

        var errorMessages = {};
        this.each(function (i, el) {
          var $el = $(el);
          var name = $el.attr("name");
          var errors = $el.triggerHandler("validation.validation", {includeEmpty: true});
          errorMessages[name] = $.extend(true, errors, errorMessages[name]);
        });

        $.each(errorMessages, function (i, el) {
          if (el.length === 0) {
            delete errorMessages[i];
          }
        });

        return errorMessages;

      },
      hasErrors: function() {

        var errorMessages = [];

        this.each(function (i, el) {
          errorMessages = errorMessages.concat(
            $(el).triggerHandler("getValidators.validation") ? $(el).triggerHandler("validation.validation", {submitting: true}) : []
          );
        });

        return (errorMessages.length > 0);
      },
      override : function (newDefaults) {
        defaults = $.extend(true, defaults, newDefaults);
      }
    },
		validatorTypes: {
      callback: {
        name: "callback",
        init: function ($this, name) {
          return {
            validatorName: name,
            callback: $this.data("validation" + name + "Callback"),
            lastValue: $this.val(),
            lastValid: true,
            lastFinished: true
          };
        },
        validate: function ($this, value, validator) {
          if (validator.lastValue === value && validator.lastFinished) {
            return !validator.lastValid;
          }

          if (validator.lastFinished === true)
          {
            validator.lastValue = value;
            validator.lastValid = true;
            validator.lastFinished = false;

            var rrjqbvValidator = validator;
            var rrjqbvThis = $this;
            executeFunctionByName(
              validator.callback,
              window,
              $this,
              value,
              function (data) {
                if (rrjqbvValidator.lastValue === data.value) {
                  rrjqbvValidator.lastValid = data.valid;
                  if (data.message) {
                    rrjqbvValidator.message = data.message;
                  }
                  rrjqbvValidator.lastFinished = true;
                  rrjqbvThis.data("validation" + rrjqbvValidator.validatorName + "Message", rrjqbvValidator.message);
                  // Timeout is set to avoid problems with the events being considered 'already fired'
                  setTimeout(function () {
                    rrjqbvThis.trigger("change.validation");
                  }, 1); // doesn't need a long timeout, just long enough for the event bubble to burst
                }
              }
            );
          }

          return false;

        }
      },
      ajax: {
        name: "ajax",
        init: function ($this, name) {
          return {
            validatorName: name,
            url: $this.data("validation" + name + "Ajax"),
            lastValue: $this.val(),
            lastValid: true,
            lastFinished: true
          };
        },
        validate: function ($this, value, validator) {
          if (""+validator.lastValue === ""+value && validator.lastFinished === true) {
            return validator.lastValid === false;
          }

          if (validator.lastFinished === true)
          {
            validator.lastValue = value;
            validator.lastValid = true;
            validator.lastFinished = false;
            $.ajax({
              url: validator.url,
              data: "value=" + value + "&field=" + $this.attr("name"),
              dataType: "json",
              success: function (data) {
                if (""+validator.lastValue === ""+data.value) {
                  validator.lastValid = !!(data.valid);
                  if (data.message) {
                    validator.message = data.message;
                  }
                  validator.lastFinished = true;
                  $this.data("validation" + validator.validatorName + "Message", validator.message);
                  // Timeout is set to avoid problems with the events being considered 'already fired'
                  setTimeout(function () {
                    $this.trigger("change.validation");
                  }, 1); // doesn't need a long timeout, just long enough for the event bubble to burst
                }
              },
              failure: function () {
                validator.lastValid = true;
                validator.message = "ajax call failed";
                validator.lastFinished = true;
                $this.data("validation" + validator.validatorName + "Message", validator.message);
                // Timeout is set to avoid problems with the events being considered 'already fired'
                setTimeout(function () {
                  $this.trigger("change.validation");
                }, 1); // doesn't need a long timeout, just long enough for the event bubble to burst
              }
            });
          }

          return false;

        }
      },
			regex: {
				name: "regex",
				init: function ($this, name) {
					return {regex: regexFromString($this.data("validation" + name + "Regex"))};
				},
				validate: function ($this, value, validator) {
					return (!validator.regex.test(value) && ! validator.negative)
						|| (validator.regex.test(value) && validator.negative);
				}
			},
			required: {
				name: "required",
				init: function ($this, name) {
					return {};
				},
				validate: function ($this, value, validator) {
					return !!(value.length === 0  && ! validator.negative)
						|| !!(value.length > 0 && validator.negative);
				},
        blockSubmit: true
			},
			match: {
				name: "match",
				init: function ($this, name) {
					var element = $this.parents("form").first().find("[name=\"" + $this.data("validation" + name + "Match") + "\"]").first();
					element.bind("validation.validation", function () {
						$this.trigger("change.validation", {submitting: true});
					});
					return {"element": element};
				},
				validate: function ($this, value, validator) {
					return (value !== validator.element.val() && ! validator.negative)
						|| (value === validator.element.val() && validator.negative);
				},
        blockSubmit: true
			},
			max: {
				name: "max",
				init: function ($this, name) {
					return {max: $this.data("validation" + name + "Max")};
				},
				validate: function ($this, value, validator) {
					return (parseFloat(value, 10) > parseFloat(validator.max, 10) && ! validator.negative)
						|| (parseFloat(value, 10) <= parseFloat(validator.max, 10) && validator.negative);
				}
			},
			min: {
				name: "min",
				init: function ($this, name) {
					return {min: $this.data("validation" + name + "Min")};
				},
				validate: function ($this, value, validator) {
					return (parseFloat(value) < parseFloat(validator.min) && ! validator.negative)
						|| (parseFloat(value) >= parseFloat(validator.min) && validator.negative);
				}
			},
			maxlength: {
				name: "maxlength",
				init: function ($this, name) {
					return {maxlength: $this.data("validation" + name + "Maxlength")};
				},
				validate: function ($this, value, validator) {
					return ((value.length > validator.maxlength) && ! validator.negative)
						|| ((value.length <= validator.maxlength) && validator.negative);
				}
			},
			minlength: {
				name: "minlength",
				init: function ($this, name) {
					return {minlength: $this.data("validation" + name + "Minlength")};
				},
				validate: function ($this, value, validator) {
					return ((value.length < validator.minlength) && ! validator.negative)
						|| ((value.length >= validator.minlength) && validator.negative);
				}
			},
			maxchecked: {
				name: "maxchecked",
				init: function ($this, name) {
					var elements = $this.parents("form").first().find("[name=\"" + $this.attr("name") + "\"]");
					elements.bind("click.validation", function () {
						$this.trigger("change.validation", {includeEmpty: true});
					});
					return {maxchecked: $this.data("validation" + name + "Maxchecked"), elements: elements};
				},
				validate: function ($this, value, validator) {
					return (validator.elements.filter(":checked").length > validator.maxchecked && ! validator.negative)
						|| (validator.elements.filter(":checked").length <= validator.maxchecked && validator.negative);
				},
        blockSubmit: true
			},
			minchecked: {
				name: "minchecked",
				init: function ($this, name) {
					var elements = $this.parents("form").first().find("[name=\"" + $this.attr("name") + "\"]");
					elements.bind("click.validation", function () {
						$this.trigger("change.validation", {includeEmpty: true});
					});
					return {minchecked: $this.data("validation" + name + "Minchecked"), elements: elements};
				},
				validate: function ($this, value, validator) {
					return (validator.elements.filter(":checked").length < validator.minchecked && ! validator.negative)
						|| (validator.elements.filter(":checked").length >= validator.minchecked && validator.negative);
				},
        blockSubmit: true
			}
		},
		builtInValidators: {
			email: {
				name: "Email",
				type: "shortcut",
				shortcut: "validemail"
			},
			validemail: {
				name: "Validemail",
				type: "regex",
				regex: "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\\.[A-Za-z]{2,4}",
				message: "Not a valid email address<!-- data-validator-validemail-message to override -->"
			},
			passwordagain: {
				name: "Passwordagain",
				type: "match",
				match: "password",
				message: "Does not match the given password<!-- data-validator-paswordagain-message to override -->"
			},
			positive: {
				name: "Positive",
				type: "shortcut",
				shortcut: "number,positivenumber"
			},
			negative: {
				name: "Negative",
				type: "shortcut",
				shortcut: "number,negativenumber"
			},
			number: {
				name: "Number",
				type: "regex",
				regex: "([+-]?\\\d+(\\\.\\\d*)?([eE][+-]?[0-9]+)?)?",
				message: "Must be a number<!-- data-validator-number-message to override -->"
			},
			integer: {
				name: "Integer",
				type: "regex",
				regex: "[+-]?\\\d+",
				message: "No decimal places allowed<!-- data-validator-integer-message to override -->"
			},
			positivenumber: {
				name: "Positivenumber",
				type: "min",
				min: 0,
				message: "Must be a positive number<!-- data-validator-positivenumber-message to override -->"
			},
			negativenumber: {
				name: "Negativenumber",
				type: "max",
				max: 0,
				message: "Must be a negative number<!-- data-validator-negativenumber-message to override -->"
			},
			required: {
				name: "Required",
				type: "required",
				message: "This is required<!-- data-validator-required-message to override -->"
			},
			checkone: {
				name: "Checkone",
				type: "minchecked",
				minchecked: 1,
				message: "Check at least one option<!-- data-validation-checkone-message to override -->"
			}
		}
	};

	var formatValidatorName = function (name) {
		return name
			.toLowerCase()
			.replace(
				/(^|\s)([a-z])/g ,
				function(m,p1,p2) {
					return p1+p2.toUpperCase();
				}
			)
		;
	};

	var getValue = function ($this) {
		// Extract the value we're talking about
		var value = $this.val();
		var type = $this.attr("type");
		if (type === "checkbox") {
			value = ($this.is(":checked") ? value : "");
		}
		if (type === "radio") {
			value = ($('input[name="' + $this.attr("name") + '"]:checked').length > 0 ? value : "");
		}
		return value;
	};

  function regexFromString(inputstring) {
		return new RegExp("^" + inputstring + "$");
	}

  /**
   * Thanks to Jason Bunting via StackOverflow.com
   *
   * http://stackoverflow.com/questions/359788/how-to-execute-a-javascript-function-when-i-have-its-name-as-a-string#answer-359910
   * Short link: http://tinyurl.com/executeFunctionByName
  **/
  function executeFunctionByName(functionName, context /*, args*/) {
    var args = Array.prototype.slice.call(arguments).splice(2);
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    for(var i = 0; i < namespaces.length; i++) {
      context = context[namespaces[i]];
    }
    return context[func].apply(this, args);
  }

	$.fn.jqBootstrapValidation = function( method ) {

		if ( defaults.methods[method] ) {
			return defaults.methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return defaults.methods.init.apply( this, arguments );
		} else {
		$.error( 'Method ' +  method + ' does not exist on jQuery.jqBootstrapValidation' );
			return null;
		}

	};

  $.jqBootstrapValidation = function (options) {
    $(":input").not("[type=image],[type=submit]").jqBootstrapValidation.apply(this,arguments);
  };

})( jQuery );

// Floating label headings for the contact form
$(function() {
    $("body").on("input propertychange", ".floating-label-form-group", function(e) {
        $(this).toggleClass("floating-label-form-group-with-value", !!$(e.target).val());
    }).on("focus", ".floating-label-form-group", function() {
        $(this).addClass("floating-label-form-group-with-focus");
    }).on("blur", ".floating-label-form-group", function() {
        $(this).removeClass("floating-label-form-group-with-focus");
    });
});

// Navigation Scripts to Show Header on Scroll-Up
jQuery(document).ready(function($) {
    var MQL = 1170;

    //primary navigation slide-in effect
    if ($(window).width() > MQL) {
        var headerHeight = $('.navbar-custom').height();
        $(window).on('scroll', {
                previousTop: 0
            },
            function() {
                var currentTop = $(window).scrollTop();
                //check if user is scrolling up
                if (currentTop < this.previousTop) {
                    //if scrolling up...
                    if (currentTop > 0 && $('.navbar-custom').hasClass('is-fixed')) {
                        $('.navbar-custom').addClass('is-visible');
                    } else {
                        $('.navbar-custom').removeClass('is-visible is-fixed');
                    }
                } else {
                    //if scrolling down...
                    // $('.navbar-custom').removeClass('is-visible');
                    if (currentTop > headerHeight && !$('.navbar-custom').hasClass('is-fixed')) {
                       $('.navbar-custom').addClass('is-fixed');
                       $('.navbar-custom').addClass('is-visible');
                    }
                }
                this.previousTop = currentTop;
            });
    }
});

$('#nav-login').click(
  function(){
    $(this).toggle();
    $('#nav-register').toggle();
    $('#nav-username').toggle();
    $('#nav-password').toggle();
    $('#nav-cart').toggle();

   /* $('#nav-userlogged').toggle();*/
  }
);

/* Local DB*/
if(localStorage.getItem('userData') == null){
  var userData = [
    {"username":"sample", 
      "password":"sample",
      "isowner":"false",
      "firstname":"Sample",
      "lastname":"McSample"},
    {"username":"admin", 
      "password":"abcd123",
      "isowner":"false",
      "firstname":"Admin",
      "lastname":"Powerful"}
  ];
  localStorage.setItem('userData', JSON.stringify(userData));
}
if(localStorage.getItem('postData') == null){
  var postData = [
    {'name': 'Akamaru Shinaji Ramen',
     'price': '$14',
      'restaurant': 'Ippudo',
      'cuisine': 'Japanese',
      'image': 'http://ippudo.co.id/wp-content/uploads/2014/10/Akamaru-Shinaji1.jpg'},
    {'name': 'Negi Miso Ramen',
     'price': '$9',
      'restaurant': 'Goshu Ramen Tei',
      'cuisine': 'Japanese',
      'image': 'https://farm8.staticflickr.com/7755/17717932023_db4fdba212_b.jpg'},
    {'name': 'Tenkomori Ramen',
     'price': '$8.9',
      'restaurant': 'Tenkomori',
      'cuisine': 'Japanese',
    'image': 'http://tenkomori.com.au/wp-content/uploads/2016/04/tenkomori-ramen.png'},
    {'name': 'Chicken Karaage Cheese Curry Ramen',
     'price': '$10',
      'restaurant': 'Ramen Kan',
      'cuisine': 'Japanese',
    'image': 'https://travelwithbokuwajanice.files.wordpress.com/2011/08/img_0661.jpg?w=605&h=403'},
    {'name': 'Ikkyu Shoyu Ramen',
     'price': '$10',
      'restaurant': 'Ramen Ikkyu',
      'cuisine': 'Japanese',
    'image': 'http://1.bp.blogspot.com/-w4DQcl0H2vw/Ue-0extc5PI/AAAAAAAAXaU/qe6gXiPmxqc/s1600/ramen+ikkyu+031.JPG'},
    {'name': 'Chicken Katsu Curry',
     'price': '$8',
      'restaurant': 'Oiden',
      'cuisine': 'Japanese',
    'image': 'http://files.stv.tv/imagebase/208/650x366/208149-chicken-katsu-curry.jpg'},
    {'name': 'Pork Katsu Curry',
     'price': '$10',
      'restaurant': 'Sakuratei',
      'cuisine': 'Japanese',
    'image': 'https://mamasrecipesandafew.files.wordpress.com/2012/08/tetsu_09.jpg'},
    {'name': 'Butter Chicken Curry',
     'price': '$9',
      'restaurant': 'Jewel of India',
      'cuisine': 'Indian',
    'image': 'http://mda.bigoven.com/pics/indian-butter-chicken-8.jpg'},
    {'name': 'Tonkotsu Ramen',
     'price': '$14.9',
      'restaurant': 'Gumshara',
      'cuisine': 'Japanese',
    'image': 'http://s3-media4.fl.yelpcdn.com/bphoto/56OKwoe0Y5j_wstTn8TO-A/o.jpg'}
  ];
  localStorage.setItem('postData', JSON.stringify(postData));
}

if(localStorage.getItem('loggedIn') == null){
  localStorage.setItem('loggedIn', false);
}

function regSuccess() {
    var validateUser = $('#username-reg').val();
    var validatePassword = $('#password-reg').val();
    var validateFirstName = $('#firstname-reg').val();
    var validateLastName = $('#lastname-reg').val();
    var validateEmail = $('#email').val();
    var validateConfEmail = $('#confirm-email').val();
    var validateIsOwner = $('#isowner-reg').val();


    if(validateUser && validateFirstName && validateLastName && validatePassword && validateEmail && validateEmail == validateConfEmail ){
      var retrievedObject = JSON.parse(localStorage.getItem('userData'));

      for (user in retrievedObject){
        if(retrievedObject[user]['username'] == $('#username-reg').val()){
          alert("Username already taken!");
          console.log(retrievedObject);
          return;
        }
      }
      var username = $('#username-reg').val();
      var password = $('#password-reg').val();
      var firstname = $('#firstname-reg').val();
      var lastname = $('#lastname-reg').val();

      
      var newUser = new Object();
          newUser["username"] = username;
          newUser["password"] = password;
          newUser["firstname"] = firstname;
          newUser["lastname"] = lastname;
      if(validateIsOwner == ""){
          newUser["isowner"] = "false";
      }
      else if (validateIsOwner == "FEEDMEOWNER"){
        newUser["isowner"] = "true";
      }
      else{
        alert("Wrong Code!")
        return;
      }
      retrievedObject.push(newUser);
      localStorage.setItem('userData', JSON.stringify(retrievedObject));
      alert("Successfully registered!");

      location.replace("index.html");
    }
    else{
      alert("Please fill in all fields");
    }
}

function listFunction(){
    var validateName = $('#name-post').val();
    var validatePrice = $('#price-post').val();
    var validateRestaurant = $('#restaurant-post').val();
    var validateCuisine = $('#cuisine-post').val();
    var validateImage = $('#image-post').val();

    for (user in retrievedObject){
      if(retrievedObject[user]['username'] == localStorage.getItem('loggedUser')){
        if(retrievedObject[user]['isowner'] != "true"){
            alert("Error: Not a restaurant owner!");
            return;
        }
      }
    }

    if(validateName && validatePrice && validateRestaurant && validateCuisine){
      var str = localStorage.getItem('postData');
      str =  str.substring(0, str.length - 1);
      if(validateImage == null || validateImage == ""){
        validateImage = "img/no-image-placeholder.png"
      }
      var add = ',{"name": "'+ validateName +'","price": "$' + validatePrice + '","restaurant": "'+ validateRestaurant +'","cuisine": "'+ validateCuisine+'","image": "'+ validateImage +'"}]';
      str = str + add;
      localStorage.setItem('postData', str);
      alert("Successfully listed!");
    }
    else{
      alert("Please fill in all fields");
    }
}

function searchFunction(){
  var search = $('#search').val();
  localStorage.setItem('search', search);
}

if(localStorage.getItem('search') != null){
  $(".search-results").text("Results for " + localStorage.getItem('search'));
  if (localStorage.getItem('search') == "" || localStorage.getItem('search') == " "){
    $(".search-results").text("All results");
  }
}
else{
  $(".search-results").text("Search an item");
}

function login(){

  event.preventDefault(); // prevent PageReLoad
  var retrievedObject = JSON.parse(localStorage.getItem('userData'));
  for (user in retrievedObject){
    if(retrievedObject[user]['username'] == $('#username').val()){
        if(retrievedObject[user]['password'] == $('#password').val()){
          $('#nav-userlogged').toggle();
          $('#nav-username').toggle();
          $('#nav-password').toggle();
          $('#nav-logout').toggle();
          $('#nav-cart').toggle();
          $('.login-box-name').text(retrievedObject[user]['firstname'] + " " + retrievedObject[user]['lastname']);

          localStorage.setItem('loggedIn', true);
          localStorage.setItem('loggedUser', $('#username').val());
          $('#nav-userlogged > a').text("G'day " + localStorage.getItem('loggedUser'));
          if(retrievedObject[user]['isowner'] == "true"){
            $("#owner-list").show();
            $("#not-owner-list").hide();
          }
          else{
            $("#owner-list").hide();
            $("#not-owner-list").show();
          }
          localStorage.removeItem('cart');
          break;
        }
        else {
          alert("Wrong password!");
          break;
        }
    }
    if(retrievedObject[user] === retrievedObject[retrievedObject.length - 1] && retrievedObject[user]['username'] != $('#username').val()){
      alert("User not found!");
    }
  }
  $("#nav-username input").val("")
  $("#nav-password input").val("")
}

function order(){
  var ordered = [];
  if(localStorage.getItem('orderData') != null){
    ordered = JSON.parse(localStorage.getItem('orderData'));
  }

  var currentCart = localStorage.getItem('cart');
  var address = $('#address').val();
  var cred = $('#credit-payment').val();
  var deliver = "";
  if(document.getElementById("pickup").checked == true){
    deliver = "pickup";
  }
  else if (document.getElementById("deliver").checked == true){
    deliver = "deliver";
  }
  if( !address || !cred || deliver == ""){
    alert("Fill in all fields");
    return;
  }

  if( cred.length > 16){
    alert("Invalid credit card number!");
    return;
  }
  var d = new Date();
  var date = d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear();

  var selection = new Object();
          selection["cart"] = currentCart;
          selection["address"] = address;
          selection["payment"] = cred;
          selection["delivery"] = deliver;
          selection["user"] = localStorage.getItem('loggedUser');
          selection["orderid"] = ordered.length + 1;
          selection["date"] = date;

  ordered.push(selection);
  localStorage.setItem('orderData', JSON.stringify(ordered));
  alert("Order placed!");
  localStorage.removeItem('cart');
  location.replace("post-feed.html");
}

function logout(){
  localStorage.setItem('loggedIn', false);
  $('#nav-userlogged').toggle();
  $('#nav-logout').toggle();
  $('#nav-register').toggle();
  $('#nav-login').toggle();
}

/** Check if logged in **/
if(localStorage.getItem('loggedIn') == "true"){
  var retrievedObject = JSON.parse(localStorage.getItem('userData'));
  $('#nav-userlogged > a').text("G'day " + localStorage.getItem('loggedUser'));
  $('#nav-userlogged').toggle();
  $('#nav-logout').toggle();
  $('#nav-login').toggle();
  $('#nav-register').toggle();
  for (user in retrievedObject){
    if(retrievedObject[user]['username'] == localStorage.getItem('loggedUser')){
      $('.login-box-name').text(retrievedObject[user]['firstname'] + " " + retrievedObject[user]['lastname']);
      if(retrievedObject[user]['isowner'] == "true"){
        $("#owner-list").show();
        $("#not-owner-list").hide();
      }
      else{
        $("#owner-list").hide();
        $("#not-owner-list").show();
      }
      break;
    }
  }
}


// var userData = [
//     {"username":"John", "password":"Doe"},
//     {"username":"Anna", "password":"Smith"},
//     {"username":"Peter","password": "Jones"}
// ];
// // Put the object into storage

// var str = JSON.stringify(userData);
// str =  str.substring(0, str.length - 1);

// var username = "sample";
// var password = "password";

// var add = ',{"username":"' + username + '","password":"' + password + '"}]';
// str = str + add;

// localStorage.setItem('userData', str);
// console.log(JSON.parse(str));
// // Retrieve the object from storage
// var retrievedObject = JSON.parse(localStorage.getItem('userData'));
// console.log('retrievedObject: ', retrievedObject);

var app = angular.module('myApp', []);
app.controller('postsListController', function($scope) {

  $scope.posts = JSON.parse(localStorage.getItem('postData'));
  $scope.sResults = [];
  for (post in $scope.posts){
    if(localStorage.getItem('search') != null){
      if($scope.posts[post]['name'].toLowerCase().includes(localStorage.getItem('search').toLowerCase())){
        $scope.sResults.push($scope.posts[post]);
      }
    }
    else{
      $scope.sResults.push($scope.posts[post]);
    }
  }

  $scope.currentCart = JSON.parse(localStorage.getItem('cart'));

  var allOrders = JSON.parse(localStorage.getItem('orderData'));
  $scope.orders = [];
  //$scope.cartItem = [];


  for( item in allOrders){
    if(allOrders[item]["user"] == localStorage.getItem('loggedUser')){
      $scope.orders.push(allOrders[item]);
      //$scope.cartItem.push({ "cart" : JSON.parse(allOrders[item]["cart"]) });
    }
  }

  for( it in $scope.orders){
    $scope.orders[it]["cart"] = JSON.parse($scope.orders[it]["cart"]);
  }
  // $scope.refresh = function(){
  //   $scope.currentCart = JSON.parse(localStorage.getItem('cart'));
  // }

});


// app.controller('cartController', function($scope) {

//   $scope.currentCart = JSON.parse(localStorage.getItem('cart'));
//   $scope.items = []
//   for(cartItems in $scope.currentCart){
//     $scope.items.push($scope.currentCart[cartItems]);
//   }

// });
/******Custom Jquery Stuff******/
$(document).ready(function() {
    $('select').material_select();
    
    $('#nav-userlogged a').click(function(){
      $('.cart-box').hide();
      $('.profile-box').fadeIn(500);
      profileTimeOut = setTimeout(function(){
          $('.profile-box').fadeOut(2000);
        }, 5000);
    });                                    

    $('.profile-box').mouseout(function(){
        profileTimeOut = setTimeout(function(){
          $('.profile-box').fadeOut(2000);
        }, 3000);
    });
    $('.profile-box').mouseover(function(){
        clearTimeout(profileTimeOut);
    });

    $('#nav-cart').click(function(){
      $('.profile-box').hide();
      $('.cart-box').fadeIn(500);
      cartTimeOut = setTimeout(function(){
          $('.cart-box').fadeOut(2000);
        }, 5000);
    });                                    

    $('.cart-box').mouseout(function(){
        cartTimeOut = setTimeout(function(){
          $('.cart-box').fadeOut(2000);
        }, 3000);
    });
    $('.cart-box').mouseover(function(){
        clearTimeout(cartTimeOut);
    });

    var cartRefresh = function(){
      var cartItems = JSON.parse(localStorage.getItem('cart'));
      var sum = 0;
      for(items in cartItems){
        sum += parseFloat(cartItems[items]["price"]);
      }
      $('div#totalPrice').text("$" + sum);
    }

    cartRefresh();

    $('.add-to-cart-link').click(function(){
      Materialize.toast('Added to cart', 4000);
      var array = []
      var name = $(this).siblings('.col-lg-10').find('.title').text();
      var restaurant = $(this).siblings('.col-lg-10').find('.restaurant').text();
      var price = $(this).find('.addtocart').find('.price').text();
      price = price.slice(1, price.length);
      if(localStorage.getItem('cart') == null){
        var selection = new Object();
          selection["name"] = name;
          selection["restaurant"] = restaurant;
          selection["price"] = price;
        array.push(selection);
        localStorage.setItem('cart', JSON.stringify(array));
      }
      else{
        var currentCart = JSON.parse(localStorage.getItem('cart'));
        var selection = new Object();
          selection["name"] = name;
          selection["restaurant"] = restaurant;
          selection["price"] = price;
        currentCart.push(selection);
        localStorage.setItem('cart', JSON.stringify(currentCart));
      }
      cartRefresh();

      var appElement = document.querySelector('[ng-app=myApp]');
      var $scope = angular.element(appElement).scope();
      $scope.$apply(function() {
          $scope.currentCart = JSON.parse(localStorage.getItem('cart'));
      });

    });

});

