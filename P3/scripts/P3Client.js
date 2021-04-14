/* This file controls the behaviour of p1.html.
@Author: Tiffany Conrad A00414194
@Author Alexandra Embree (A00443068)
@Author Tahira Tabassum (A00416670)
*/

// Easy access to the server URL
var SERVER_URL = "http://ugdev.cs.smu.ca:3909";

/**
 * This function initializes the webpage,
 * while processing the input from each slider
 * @author Tiffany Conrad (A00414194)
 */
function init() {
  drawLogo();
  $("#windowSlider").on("change", function () {
    processInput();
  });

  $("#opaqueThickness").on("change", function () {
    processInput();
  });

  $("#opaqueThick").on("change", function () {
    processInput();
  });

  $("#doorSlider").on("change", function () {
    processInput();
  });

  $("#windThermal").on("change", function () {
    processInput();
  });

  $("#insulationOptions").on("change", function () {
    processInput();
  });

  $("#degrees").on("change", function () {
    processInput();
  });

  $("#opaqueThermal").on("change", function () {
    processInput();
  });
  $("#effectiveOverallReadout").on("change", function () {
    processInput();
  });
  $("#kWh").on("change", function () {
    processInput();
  });
  $("#chapters").on("change", function () {
    processInput();
  });

  let construction = $("#opaqueThick").val();
  let window = $("#windowSlider").val();
  draw(construction, window);

  //Ensures bottom of page is cleared at startup
  clearBottom();
}

// dropdown menu constants for insulation
const BARE = "Bare Container (R1)";
const FINISH_ONLY = "Plus Interior Finish, Uninsulated (R2)";
const CELLULOSE = "Plus Finish and Cellulose (R3/in)";
const FIBERGLASS = "Plus Finish and Fiberglass (R3/in)";
const SPRAY_FOAM = "Plus Finish and Spray Foam (R6/in)";

// Crate proportion for canvas 1 (in inches/before magnification)
const CANVAS_HEIGHT = 132;
const CANVAS_WIDTH = 238;
const DOOR_LENGTH = 36;
const CONTAINER_WIDTH = CANVAS_WIDTH;
const CONTAINER_HEIGHT = CANVAS_HEIGHT - DOOR_LENGTH;

// When drawing on canvas, always multiply constants by multiplier
const MAGNIFIER = 1.35;

//Adjusted container sizes for drawing
const ADJ_CONTAINER_WIDTH = CONTAINER_WIDTH * MAGNIFIER;
const ADJ_CONTAINER_HEIGHT = CONTAINER_HEIGHT * MAGNIFIER;

/*This function hides or shows the bottom half of the page
depending on selection in "VIEW CHAPTERS" menu.

Author: Alexandra Embree (A00443068)
*/

function clearBottom() {
  let choice = $("#chapters").find(":selected").text();
  let page = document.getElementById("clearedArea");

  if (choice != "Insulation") {
    page.hidden = true;
  } else {
    page.hidden = false;
  }
}

/* Selects the appropriate color to represent
the selected insulation option
Author: Alexandra Embree (A00443068)*/
function changeInsulation() {
  let plan = document.getElementById("plan");
  let context = plan.getContext("2d");

  let choice = $("#insulationOptions").find(":selected").text();

  if (choice == BARE) {
    context.fillStyle = "#d2cbcd";
    context.fillRect(0, 0, ADJ_CONTAINER_WIDTH, ADJ_CONTAINER_HEIGHT);
  } else if (choice == FINISH_ONLY) {
    context.fillStyle = "#d2cbcd";
    context.fillRect(0, 0, ADJ_CONTAINER_WIDTH, ADJ_CONTAINER_HEIGHT);
  } else if (choice == CELLULOSE) {
    context.fillStyle = "#e8e5e4";
    context.fillRect(0, 0, ADJ_CONTAINER_WIDTH, ADJ_CONTAINER_HEIGHT);
  } else if (choice == FIBERGLASS) {
    context.fillStyle = "#fec7d4";
    context.fillRect(0, 0, ADJ_CONTAINER_WIDTH, ADJ_CONTAINER_HEIGHT);
  } else if (choice == SPRAY_FOAM) {
    context.fillStyle = "#fdfaaa";
    context.fillRect(0, 0, ADJ_CONTAINER_WIDTH, ADJ_CONTAINER_HEIGHT);
  } else {
    context.fillStyle = "#d2cbcd";
    context.fillRect(0, 0, ADJ_CONTAINER_WIDTH, ADJ_CONTAINER_HEIGHT);
  }
}

/* This function draws the logo in the first block of the grid
   
  Tiffany Conrad (A00414194)
*/
function drawLogo() {
  // Finds proper div for logo
  let logo = document.getElementById("log");
  // Draw on that div, 2-dimensionally
  let context = logo.getContext("2d");

  context.font = "bold 30px Georgia";
  context.fillStyle = "blue";
  context.fillText("PROJECT XS", 50, 89);
}

/*
  This function processes input from the opaque Thickness slider and the window slider, then draws the canvases according to 
  the given values of sliders and insulation options

  @author Tiffany Conrad (A00414194)
*/
function processInput() {
  // construction slider value
  let construction = $("#opaqueThick").val();
  let constructionType = $("#insulationOptions option:selected").val();
  // Window Slider value
  let window = $("#windowSlider").val();

  draw(construction, window);
  opaqueThick(construction, constructionType);
  calculateOutputBoxes(construction, window);
  alertChapters();
  concept();
}

/*
  This function draws the changes made by the Opaque Thickness Slider, as well as the window Slider.

  construction is the number value from the Opaque Thickness Slider
  window is the value from the Window slider

  @author Tiffany Conrad-- All drawings made on the plan Canvas
  @author Tahira Tabassum-- All drawings made on Elevation canvas
*/

function draw(construction, window) {
  // Finds the plan canvas div
  let plan = document.getElementById("plan");
  // gives 2-dimensional context to Plan
  let contextP = plan.getContext("2d");
  let windowSquareFootage = $("#winSlidOut").val();

  // Where we begin to draw the door
  const DOOR_X = (plan.width * 2) / 3;
  const INIT_DOOR_Y = (178 * 3) / 4;
  const FIN_DOOR_Y = 178 * 27 * MAGNIFIER;
  contextP.clearRect(0, 0, plan.width, 178);

  // Selected Elevation div to draw the elevation plan
  let elevation = document.getElementById("elevation");
  // gives 2-dimensional context to elevation plan
  let contextE = elevation.getContext("2d");
  contextE.clearRect(0, 0, elevation.width, elevation.height);

  // elevation canvas
  // filled wall
  contextE.fillStyle = "#a3bcfd";
  contextE.fillRect(0, 0, elevation.width, elevation.height);

  // elevation door OUTER
  contextE.strokeStyle = "black";
  contextE.strokeRect(
    (elevation.width * 2) / 3,
    (elevation.height * 3) / 10 + MAGNIFIER,
    MAGNIFIER * 3 * 12,
    MAGNIFIER * (6 * 12) + 3
  );

  // elevation door INNER
  contextE.strokeStyle = "black";
  contextE.strokeRect(
    (elevation.width * 2) / 3 + 2 * MAGNIFIER,
    (elevation.height * 3) / 10 + 3 * MAGNIFIER,
    (MAGNIFIER * 3 * 12 * 9) / 10,
    ((MAGNIFIER * (6 * 12) + 3) * 18) / 19
  );

  //elevation door-knob
  contextE.strokeStyle = "black";
  contextE.arc(250, 100, 3, 0, 2 * Math.PI);
  contextE.stroke();
  contextE.closePath();

  // elevation window
  if (windowSquareFootage >= 1.5) {
    // Outer Window
    contextE.strokeStyle = "black";
    contextE.lineWidth = MAGNIFIER;
    contextE.strokeRect(
      ((100 * MAGNIFIER - window * MAGNIFIER) / 2) * MAGNIFIER + 25 * MAGNIFIER,
      ((25 * MAGNIFIER) / 2) * MAGNIFIER + 10 * MAGNIFIER,
      (((2 * window * MAGNIFIER + Number(4)) / 2) * MAGNIFIER * 3) / 4,
      (((Number(((3 * window) / 2) * MAGNIFIER) + Number(4)) / 2) *
        MAGNIFIER *
        3) /
        4
    );

    // Inner Window
    contextE.strokeRect(
      ((104 * MAGNIFIER - window * MAGNIFIER) / 2) * MAGNIFIER + 25 * MAGNIFIER,
      ((29 * MAGNIFIER) / 2) * MAGNIFIER + 10 * MAGNIFIER,
      (((2 * window * MAGNIFIER) / 2) * MAGNIFIER * 3) / 4 - 4 * MAGNIFIER,
      (((Number(((3 * window) / 2) * MAGNIFIER) / 2) * MAGNIFIER -
        2 * MAGNIFIER) *
        3) /
        4 -
        3 * MAGNIFIER
    );
    contextE.closePath();
  }

  // PLAN
  // Plan Slab
  contextP.fillStyle = "#d2cbcd";
  contextP.fillRect(0, 0, plan.width, 182);

  // Draw Plan Door

  contextP.strokeStyle = "black";
  contextP.lineWidth = MAGNIFIER * 2;

  contextP.beginPath();
  contextP.setLineDash([0]);
  contextP.moveTo(DOOR_X, INIT_DOOR_Y);
  contextP.lineTo(DOOR_X, FIN_DOOR_Y);
  contextP.stroke();
  contextP.closePath();

  // Draw insulation
  changeInsulation();

  const END_RECT_Y = (178 * 3) / 4 - 2 * MAGNIFIER;
  //Draw outer wall
  contextP.setLineDash([0]);
  contextP.strokeStyle = "#3104fb";
  contextP.lineWidth = MAGNIFIER;
  contextP.beginPath();
  contextP.strokeRect(
    MAGNIFIER,
    MAGNIFIER,
    plan.width - MAGNIFIER * 2,
    END_RECT_Y
  );
  contextP.closePath();

  // Inner Wall
  contextP.beginPath();
  contextP.fillStyle = "#d2cbcd";
  contextP.lineWidth = MAGNIFIER * 2;
  contextP.strokeStyle = "#3104fb";
  contextP.strokeRect(
    construction * MAGNIFIER + 4,
    construction * MAGNIFIER + 4,
    plan.width - 2 * construction * MAGNIFIER - 8,
    END_RECT_Y - 2 * construction * MAGNIFIER - Number(4)
  );

  // Draw door swing
  contextP.strokeStyle = "black";
  contextP.lineWidth = MAGNIFIER;
  contextP.beginPath();
  contextP.setLineDash([4, 3]);
  contextP.arc(DOOR_X, (178 * 3) / 4, 3 * 12 * MAGNIFIER, 0, Math.PI * 0.5);
  contextP.stroke();

  //Inner slab
  contextP.fillStyle = "#d2cbcd";
  contextP.beginPath();
  contextP.fillRect(
    construction * MAGNIFIER + 4,
    construction * MAGNIFIER + 4,
    plan.width - 2 * construction * MAGNIFIER - 8,
    END_RECT_Y - 2 * construction * MAGNIFIER - Number(4)
  );
  contextP.closePath();

  const PLACEMENT = (window / 2) * MAGNIFIER;

  // Draw Plan Window
  if (windowSquareFootage >= 1.5) {
    contextP.lineWidth = MAGNIFIER;
    contextP.setLineDash([4, 3]);
    contextP.strokeStyle = "black";
    contextP.fillStyle = "#07ebf8";
    contextP.beginPath();
    contextP.fillRect(
      (plan.width / 3) * MAGNIFIER - PLACEMENT - 25,
      ((178 * 3) / 4 -
        Number(2 * MAGNIFIER) -
        2 * construction * MAGNIFIER -
        4 +
        ((178 * 3) / 4 - 2 * MAGNIFIER)) /
        2 +
        MAGNIFIER,
      Number(2 * PLACEMENT),
      construction * MAGNIFIER + Number(2 * MAGNIFIER)
    );
    contextP.closePath();

    // Top Dashed Line--PLAN
    contextP.setLineDash([3, 4]);
    contextP.strokeStyle = "black";
    contextP.moveTo(
      (plan.width / 3) * MAGNIFIER - PLACEMENT - 25,
      END_RECT_Y - construction * MAGNIFIER
    );
    contextP.lineTo(
      (plan.width / 3) * MAGNIFIER - PLACEMENT - 25 + Number(2 * PLACEMENT),
      END_RECT_Y - construction * MAGNIFIER
    );
    contextP.stroke();
    contextP.closePath();

    // Bottom Dashed Line--PLAN
    contextP.setLineDash([3, 4]);
    contextP.strokeStyle = "black";
    contextP.moveTo((plan.width / 3) * MAGNIFIER - PLACEMENT - 25, END_RECT_Y);
    contextP.lineTo(
      (plan.width / 3) * MAGNIFIER - PLACEMENT - 25 + Number(2 * PLACEMENT),
      END_RECT_Y
    );
    contextP.stroke();
    contextP.closePath();
  }

  contextP.setLineDash([4, 3]);
  contextP.fillStyle = "#d2cbcd";
  contextP.beginPath();

  contextP.fillRect(
    DOOR_X,
    ((178 * 3) / 4 -
      Number(2 * MAGNIFIER) -
      2 * construction * MAGNIFIER -
      4 +
      ((178 * 3) / 4 - 2 * MAGNIFIER)) /
      2 +
      MAGNIFIER,
    3 * 12 * MAGNIFIER,
    construction * MAGNIFIER + Number(2 * MAGNIFIER) * 2
  );
  contextP.closePath();

  if (construction * MAGNIFIER >= 4) {
    contextP.setLineDash([4, 3]);
    contextP.strokeStyle = "black";
    contextP.beginPath();
    // Top dashed line
    contextP.moveTo(
      DOOR_X,
      ((178 * 3) / 4 -
        Number(2 * MAGNIFIER) -
        2 * construction * MAGNIFIER -
        4 +
        ((178 * 3) / 4 - 2 * MAGNIFIER)) /
        2 +
        MAGNIFIER
    );
    contextP.lineTo(
      DOOR_X + 3 * 12 * MAGNIFIER,
      ((178 * 3) / 4 -
        Number(2 * MAGNIFIER) -
        2 * construction * MAGNIFIER -
        4 +
        ((178 * 3) / 4 - 2 * MAGNIFIER)) /
        2 +
        MAGNIFIER
    );
  }

  // Bottom dashed line PLAN
  contextP.moveTo(
    DOOR_X,
    ((178 * 3) / 4 -
      Number(2 * MAGNIFIER) -
      2 * construction * MAGNIFIER -
      4 +
      ((178 * 3) / 4 - 2 * MAGNIFIER)) /
      2 +
      MAGNIFIER +
      construction * MAGNIFIER +
      2 * MAGNIFIER
  );
  contextP.lineTo(
    DOOR_X + 3 * 12 * MAGNIFIER,
    ((178 * 3) / 4 -
      Number(2 * MAGNIFIER) -
      2 * construction * MAGNIFIER -
      4 +
      ((178 * 3) / 4 - 2 * MAGNIFIER)) /
      2 +
      MAGNIFIER +
      construction * MAGNIFIER +
      2 * MAGNIFIER
  );
  contextP.stroke();
  contextP.closePath();
}

/***
 * This function draws the logo
 * @author Tiffany Conrad (A00414194)
 *
 */
function drawLogo() {
  let logo = document.getElementById("log");
  let context = logo.getContext("2d");

  context.font = "bold 30px Georgia";
  context.fillStyle = "blue";
  context.fillText("PROJECT XS", 50, 89);
}

/**
 * This function fills in the door thermal output box based on the slider value.
 * @author Alexandra Embree
 */
function doorThermalResistanceOutput() {
  let doorThermalResistance = $("#doorSlider").val();
  $("#doorSliderReadout").val(doorThermalResistance);
}

/**
 *  This function writes the concepts, depending on the user's choice from the Concepts dropdown menu
 *  Receives information from Server (P3Server.js)
 */
function concept() {
  // Value of concepts to ensure the proper value is used to return the proper string
  let concept = $("#concepts").val();

  // Ensures that this only works on the insulation option of the chapters <select>
  let chapters = $("#chapters").val();
  let element = $("#text");

  if (chapters == "top") {
    $("#text").html(" ");
  } else if (chapters == "2") {
    if (concept === "1") {
      $.get(SERVER_URL + "/concepts", function (data) {
        element.html(data.localConditions);
      }).fail(function (error) {
        alert(error.responseText);
      });
    } else if (concept === "2") {
      $.get(SERVER_URL + "/concepts", function (data) {
        element.html(data.annualEnergy);
      }).fail(function (error) {
        alert(error.responseText);
      });
    } else if (concept === "3") {
      $.get(SERVER_URL + "/concepts", function (data) {
        element.html(data.draftsVent);
      }).fail(function (error) {
        alert(error.responseText);
      });
    } else if (concept === "4") {
      $.get(SERVER_URL + "/concepts", function (data) {
        element.html(data.insulationHeatLoss);
      }).fail(function (error) {
        alert(error.responseText);
      });
    } else if (concept === "5") {
      $.get(SERVER_URL + "/concepts", function (data) {
        element.html(data.materialInsul);
      }).fail(function (error) {
        alert(error.responseText);
      });
    } else if (concept === "6") {
      $.get(SERVER_URL + "/concepts", function (data) {
        element.html(data.enviroImpact);
      }).fail(function (error) {
        alert(error.responseText);
      });
    }
  }
}

/**
 * This function fills the opaque thickness readout as it corresponds with the slider
 *
 * @author Tiffany Conrad (A00414194)
 *
 * @param  construction The Opaque Thickness Slider
 * @param  constructionType The chosen insulation
 */
function opaqueThick(construction, constructionType) {
  let slider = $("#opaqueThick").val();
  let readout = $("#opaqueThickness").val(construction);

  let wallR = 0;

  while (construction <= 4) {
    readout.val(4);
    break;
  }
  if (construction >= 4 && constructionType != "top" && construction != 2) {
    let DTI = construction - 2;
    let materialR = $("construction option:selected").val();
    wallR = 2 + DTI * materialR * slider;
    readout.val(wallR);
  } else if (construction <= 4) {
    readout.val(4);
  }
}

/**
 * This function calculates and prints the appropriate output for the window area in sq ft
 * in the "Window Area" readout, and prints the opaque thickness readout in inches.
 *
 * @author Alexandra Embree
 */
function calculateOutputBoxes(construction, window) {
  //prints opaque thickness in readout box (to be modified***)
  $("#opaqueThickness").val(construction);

  // calculates window area in square feet and truncates the result
  let windowArea = (window / 12) * (((window / 12) * 3) / 4);
  let windowAreaTrunc = Math.trunc(Number(windowArea) * 10) / 10;
  let opaqueThickness = $("#opaqueThickness").val();
  let opaqueConstructionWithR = $("#insulationOptions").val();

  let windowThermalResistance = $("#windowThermal").val();
  let doorThermalResistance = $("#doorSliderReadout").val();

  // prints window area value in readoutbox
  $("#winSlidOut").val(windowAreaTrunc);

  $("#opaqueThermal").val(
    opaqueThermalResistanceOutput(opaqueThickness, opaqueConstructionWithR)
  );
  $("#effectiveOverallReadout").val(
    effectiveOverallThermalResistanceOutput(
      opaqueThermalResistanceOutput(opaqueThickness, opaqueConstructionWithR),
      windowThermalResistance,
      doorThermalResistance
    )
  );

  $("#kWh").val(annualEnergyOutput());
}

/**
 * This function fills in the window thermal output box based on the slider value.
 * @author Alexandra Embree
 */
function windowThermalResistanceOutput() {
  let windowThermalResistance = $("#windThermal").val();
  $("#windowThermal").val(windowThermalResistance);
}

/**
 * This function calculates the Opaque Thermal Resistance using the given formula
 * D = 2 + (C_output - 2) * B
 * @author Tahira Tabassum
 */
function opaqueThermalResistanceOutput(
  opaqueThickness,
  opaqueConstructionWithR
) {
  // Getting the variables
  let opaqueThicknessReadoutValue = $("#opaqueThickness").val();
  let opaqueThicknessSliderValue = $("#opaqueThick").val();
  let previousOTR = $("#effectiveOverallReadout").val();

  if(opaqueConstructionWithR == "top") {
    return previousOTR;
  }

  else {
    if(opaqueThicknessReadoutValue >= 4) {
      return Math.trunc(2 + (opaqueThickness - 2) * opaqueConstructionWithR);
    }
    else{
      return "";
    }
  }
}

/** This function calculates the Effective Overall Thermal Resistance using the given formula, which also initially appears blank
 * H = 1/ (((800 - G_output)/D + G_output / F_output + 20 / E_output) / 820)
 * Modified to only return value when opaque thickness >= 4
 *
 * @author Tahira Tabassum
 * @author Alexandra Embree
 */
function effectiveOverallThermalResistanceOutput(
  opaqueThermalResistanceOutput,
  windowThermalResistanceOutput,
  doorThermalResistanceOutput
) {
  //Pull variables
  let windowArea = $("#winSlidOut").val();
  let opaqueThicknessReadoutValue = $("#opaqueThickness").val();
  let opaqueThicknessSliderValue = $("#opaqueThick").val();
  let opaqueConstruction = $("#insulationOptions").val();
  let previousEOTRO = $("#effectiveOverallReadout").val();

  //If default opaque construction selected, return the old value.
  if (opaqueConstruction == "top") {
    return previousEOTRO;
  }
  //Calculate and return value, only if opaque thickness readout is greater than or equal to 4 and there is data availabe to calculate
  else {
    if (
      opaqueThicknessReadoutValue >= 4 &&
      opaqueThermalResistanceOutput != ""
    ) {
      //Round to 0 decimal places
      return Math.round(
        1 /
          (((800 - windowArea) / opaqueThermalResistanceOutput +
            windowArea / windowThermalResistanceOutput +
            20 / doorThermalResistanceOutput) /
            820)
      );
    }
    //Return no value if conditions are not met
    else {
      return "";
    }
  }
}

/**
 * This function calculates the Annual Energy using the given formula, which also initialy appears blank
 * I = (820*A*1.8*24/H) /3412 + A*1.8*24*65/3412 + 3000
 * @author Tahira Tabassum
 */
function annualEnergyOutput() {
  let windowThermal = $("#windowThermal").val();
  let doorThermal = $("#doorSliderReadout").val();
  let opaqueConstructionWithR = $("#insulationOptions").val();
  let degrees = $("#degrees").val();
  let opaqueThickness = $("#opaqueThickness").val();

  if (windowThermal >= 1 && doorThermal >= 2 && $("#degrees").val() != "top") {
    // Calculating the Annual Energy Output with the given formula
    return Math.trunc(
      (820 * degrees * 1.8 * 24) /
        effectiveOverallThermalResistanceOutput(
          $("#opaqueThermal").val(),
          windowThermal,
          doorThermal
        ) /
        3412 +
        (degrees * 1.8 * 24 * 65) / 3412 +
        3000
    );
  } else {
    return " ";
  }
}

/***
 * This function sends an alert to the user when a greyed out option is selected from Chapters
 *
 * @author Tiffany Conrad (a00414194)
 */
function alertChapters() {
  // Returns the value to ensure page is reset after selection that is under construction is choosed
  var chapter = $("#chapters").val();
  // The label on the selected option
  var chap = $("#chapters option:selected").prop("label");
  if (chapter != 2 && chapter != "top") {
    chapter = "top";
    if (alert(chap + " is under construction")) {
    }
    window.location.reload();
    init();
  }
}
