const apiRoot = "/api/";

var motorPos = 0;
var servoPos = 50;
$(document).ready(function() {
    $.ajax({
        url: apiRoot + "state",
        success: function(data) {
            $("#KPInput").val(data["KP"]);
            $("#KIInput").val(data["KI"]);
            $("#KDInput").val(data["KD"]);

            $("#motorInput").val(data["motorReference"]);
            $("#servoInput").val(data["servoPos"]);
            motorPos = data["motorReference"];
            servoPos = data["servoPos"];
        }
    });

    $("#pidButton").on("click", function() {
        $("#pidButton").text("Updating...");
        $("#pidButton").prop("disabled", true);
        $.ajax({
            url: apiRoot + "pid",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                KP: parseInt($("#KPInput").val()),
                KI: parseInt($("#KIInput").val()),
                KD: parseInt($("#KDInput").val())
            }),
            success: function(result) {
                $("#pidButton").text("Update controller parameters");
                $("#pidButton").prop("disabled", false);
            }
        })
    });

    $("#shootButton").on("click", function() {
        $.ajax({
            url: apiRoot + "solenoid",
            type: "POST",
            data: "{}"
        })
    });

    window.setInterval(function() {
        var newMotorPos = parseInt($("#motorInput").val());
        if (newMotorPos !== motorPos) {
            $.ajax({
                url: apiRoot + "motor",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify({value: motorPos})
            });
            motorPos = newMotorPos;
        }
    }, 200);

    window.setInterval(function() {
        var newServoPos = parseInt($("#servoInput").val());
        if (newServoPos !== servoPos) {
            $.ajax({
                url: apiRoot + "servo",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify({value: servoPos})
            });
            servoPos = newServoPos;
        }
    }, 200);
});

