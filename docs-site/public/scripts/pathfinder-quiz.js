(function () {
    var root = document.getElementById("quiz-container");
    if (!root) return;
  
    var questions = [
      {
        q: "Kickoff is over. The manual is open. What do you do with the first hour?",
        a: [
          { text: "Sketch how a mechanism could fit in the frame.", scores: { cad: 3 } },
          { text: "Ask what we can actually cut this week with the tools we have.", scores: { fab: 3 } },
          { text: "Look for the sensor and control problems hiding in the game.", scores: { prog: 3 } },
          { text: "Start a list of what scores, what is hard, and what we should ignore.", scores: { strat: 3 } }
        ]
      },
      {
        q: "A prototype works on the bench and fails in a match cycle. What do you check first?",
        a: [
          { text: "The model. The real part is not what we drew.", scores: { cad: 3 } },
          { text: "The build. A bolt, a bend, or a sloppy fit.", scores: { fab: 3 } },
          { text: "The log. It may be doing exactly what the code told it to do.", scores: { prog: 3 } },
          { text: "The match notes. It only fails against a certain defense.", scores: { strat: 3 } }
        ]
      },
      {
        q: "You have a free shop night and no assigned job. What do you pick up?",
        a: [
          { text: "A half-finished part and the drawing for it.", scores: { fab: 3 } },
          { text: "An Onshape assembly nobody has updated since Tuesday.", scores: { cad: 3 } },
          { text: "A button that does the wrong thing on the driver station.", scores: { prog: 3 } },
          { text: "Last event's scouting sheet, to see what we wrote down and never used.", scores: { strat: 3 } }
        ]
      },
      {
        q: "The team is arguing about two mechanisms. How do you want the argument settled?",
        a: [
          { text: "Put both in CAD and see which one packages.", scores: { cad: 3 } },
          { text: "Build the cheap one in wood and run it.", scores: { fab: 3 } },
          { text: "Ask which one we can control and reset in a match.", scores: { prog: 3 } },
          { text: "Ask which one scores the points we actually need.", scores: { strat: 3 } }
        ]
      },
      {
        q: "A sponsor walks into the shop. What do you want to show them?",
        a: [
          { text: "A clean model of the robot and why it is shaped that way.", scores: { cad: 3 } },
          { text: "A part we made, and the machine that made it.", scores: { fab: 3 } },
          { text: "The robot running a cycle, not a slide about the robot.", scores: { prog: 3 } },
          { text: "The team story: who we teach, who funds us, what the season is for.", scores: { med: 3 } }
        ]
      },
      {
        q: "Eight minutes to queue. The intake is bent. What is your useful move?",
        a: [
          { text: "Find the spare plate we already drew and modeled.", scores: { cad: 3 } },
          { text: "Get tools on it, with a mentor, and make it hold for one match.", scores: { fab: 3 } },
          { text: "Check that the motor controller still reports after the hit.", scores: { prog: 3 } },
          { text: "Tell the drive team what we can no longer do, so the plan changes.", scores: { strat: 3 } }
        ]
      },
      {
        q: "Which unfinished job bothers you the most?",
        a: [
          { text: "A model that does not match the robot on the cart.", scores: { cad: 3 } },
          { text: "A hole that was drilled in the wrong place and left that way.", scores: { fab: 3 } },
          { text: "Code on a laptop that was never deployed.", scores: { prog: 3 } },
          { text: "A great match that nobody photographed or wrote down.", scores: { med: 3 } }
        ]
      },
      {
        q: "You are teaching a new member. What do you hand them first?",
        a: [
          { text: "A simple Onshape part and the drawing standard.", scores: { cad: 3 } },
          { text: "A layout, a marker, and the rule for the tool they are allowed to use.", scores: { fab: 3 } },
          { text: "A deployed robot and one button to trace through the code.", scores: { prog: 3 } },
          { text: "A clipboard and one thing to record in every match.", scores: { strat: 3 } }
        ]
      },
      {
        q: "The game animation looks amazing. What do you trust instead?",
        a: [
          { text: "The field drawing and the robot size limit.", scores: { cad: 3 } },
          { text: "A game piece in our shop and a stopwatch.", scores: { fab: 3 } },
          { text: "Whether we can sense the piece and repeat the action.", scores: { prog: 3 } },
          { text: "The point table and the ranking-point thresholds.", scores: { strat: 3 } }
        ]
      },
      {
        q: "What feels like a finished day?",
        a: [
          { text: "A part released that fabrication did not have to guess on.", scores: { cad: 3 } },
          { text: "A part deburred, bolted, and matching the drawing.", scores: { fab: 3 } },
          { text: "A change on the robot that a driver can use tomorrow.", scores: { prog: 3 } },
          { text: "A sponsor email, a shirt proof, or a judge story sent.", scores: { med: 3 } }
        ]
      },
      {
        q: "Where do you want to be during qualifications?",
        a: [
          { text: "In the pit with the model open, ready for the next broken part.", scores: { cad: 3 } },
          { text: "In the pit with tools, on the repair crew.", scores: { fab: 3 } },
          { text: "On the driver station laptop when a fault appears.", scores: { prog: 3 } },
          { text: "In the stands with a scouting sheet.", scores: { strat: 3 } }
        ]
      },
      {
        q: "A photo of the robot is going on the website. What do you fix first?",
        a: [
          { text: "The angle hides the mechanism we actually want to explain.", scores: { cad: 2, med: 1 } },
          { text: "The wiring in the background looks like a failure.", scores: { fab: 2, med: 1 } },
          { text: "I would rather show it moving than pose it.", scores: { prog: 3 } },
          { text: "The crop, the logo, and whether a sponsor can read it.", scores: { med: 3 } }
        ]
      },
      {
        q: "Someone says the robot is done. What is still missing for you?",
        a: [
          { text: "A current assembly and a spare list that matches it.", scores: { cad: 3 } },
          { text: "Loctite, strain relief, and a part we can remake at the event.", scores: { fab: 3 } },
          { text: "An auto we have run ten times, not once.", scores: { prog: 3 } },
          { text: "A one-page plan for who we pick and why.", scores: { strat: 3 } }
        ]
      },
      {
        q: "You are stuck. What kind of help do you want?",
        a: [
          { text: "Someone to look at the mates with me.", scores: { cad: 3 } },
          { text: "Someone to show the setup on the machine, then let me try.", scores: { fab: 3 } },
          { text: "Someone to read the error with me, not take the keyboard.", scores: { prog: 3 } },
          { text: "Someone to tell me who this explanation is for.", scores: { med: 3 } }
        ]
      },
      {
        q: "Which sentence sounds like you at an outreach event?",
        a: [
          { text: "Let me show you the model and how the arm fits.", scores: { cad: 3 } },
          { text: "Let me show you the part and the machine that cut it.", scores: { fab: 3 } },
          { text: "Watch what it does when I press this.", scores: { prog: 3 } },
          { text: "Let me tell you what this team is for, then show the robot.", scores: { med: 3 } }
        ]
      },
      {
        q: "A match review starts. What do you want on the table?",
        a: [
          { text: "The mechanism that failed, next to the model of it.", scores: { cad: 3 } },
          { text: "The broken part, so we can see how it failed.", scores: { fab: 3 } },
          { text: "The log from that match.", scores: { prog: 3 } },
          { text: "Cycle counts and who outscored us.", scores: { strat: 3 } }
        ]
      },
      {
        q: "What would you rather be trusted with?",
        a: [
          { text: "Releasing drawings other people will cut.", scores: { cad: 3 } },
          { text: "A machine sign-off and a part that has to be right.", scores: { fab: 3 } },
          { text: "The deploy that goes on the competition robot.", scores: { prog: 3 } },
          { text: "The pit interview or the sponsor conversation.", scores: { med: 3 } }
        ]
      },
      {
        q: "The schedule slips in week 4. What do you cut?",
        a: [
          { text: "The extra feature that was never modeled cleanly.", scores: { cad: 3 } },
          { text: "The pretty part. Keep the one we can remake.", scores: { fab: 3 } },
          { text: "The clever auto. Keep the one the drivers can recover.", scores: { prog: 3 } },
          { text: "The task that does not change the ranking-point plan.", scores: { strat: 3 } }
        ]
      },
      {
        q: "A judge asks what you did this season. The honest answer is:",
        a: [
          { text: "I owned a mechanism in CAD from sketch to released drawing.", scores: { cad: 3 } },
          { text: "I made parts, and I can tell you which machine and why.", scores: { fab: 3 } },
          { text: "I owned a subsystem in code, including the failure cases.", scores: { prog: 3 } },
          { text: "I kept the story, the photos, or the pick list true.", scores: { med: 2, strat: 2 } }
        ]
      },
      {
        q: "If the lead put you on this job all season, you would not be annoyed.",
        a: [
          { text: "Packaging the robot so the intake, climber, and bumpers fit.", scores: { cad: 3 } },
          { text: "Cutting, fitting, and rebuilding the same part until it holds.", scores: { fab: 3 } },
          { text: "Binding buttons, reading faults, and fixing autos.", scores: { prog: 3 } },
          { text: "Scouting every match and saying who we should pick.", scores: { strat: 3 } }
        ]
      }
    ];
  
    var results = {
      cad: {
        title: "Advanced CAD",
        path: "/engineering/cad/stage1D/",
        label: "Start Pathway 2.1",
        why: "You want the machine to make sense before anyone cuts metal. On 2064 that job is Onshape: package, mates, and a model fabrication can hold.",
        next: "Learn design-for-shop, not just shapes. A render that cannot be built is not done."
      },
      fab: {
        title: "Advanced Fabrication",
        path: "/fabrication/fabricationadvanced/",
        label: "Start Pathway 2.2",
        why: "You trust a part in your hand more than a part on a screen. This path is the CNC, lathe, mill, and printers, after a separate machine sign-off.",
        next: "General shop safety is not machine clearance. Ask the fabrication lead which machine comes first."
      },
      prog: {
        title: "Software and Controls",
        path: "/engineering/programminglanding/",
        label: "Start Pathway 2.3",
        why: "You debug. An FRC robot without code is a chassis. This path is Java, WPILib, sensors, and the button map the drive team uses.",
        next: "Deploy it and drive it. Code that has only been explained is not finished."
      },
      med: {
        title: "Media and NEMO",
        path: "/media/medialanding/",
        label: "Start Pathway 2.4",
        why: "You notice the story, the sponsor, and the room. Imagery, business, and outreach are how the Panther Project gets funded and judged off the field.",
        next: "NEMO is a primary path. Ask the media lead for one real job this week, not a watch-from-the-side role."
      },
      strat: {
        title: "Strategy and scouting",
        path: "/media/medialanding/",
        label: "Talk to the strategy lead",
        why: "You want the match plan, not only the mechanism. On this team that work sits with Media and NEMO: scouting sheets, partner picks, and ranking points.",
        next: "Tell that lead you want scouting, not imagery. The quiz is a hint. The lead places you."
      }
    };
  
    var index = 0;
    var scores = { cad: 0, fab: 0, prog: 0, med: 0, strat: 0 };
  
    function el(id) {
      return document.getElementById(id);
    }
  
    function render() {
      var q = questions[index];
      el("question").textContent = q.q;
      el("progress-text").textContent = "Question " + (index + 1) + " of " + questions.length;
      el("progress").style.width = Math.round((index / questions.length) * 100) + "%";
      var answers = el("answers");
      answers.textContent = "";
      q.a.forEach(function (answer) {
        var button = document.createElement("button");
        button.type = "button";
        button.className = "answer-btn";
        button.textContent = answer.text;
        button.addEventListener("click", function () {
          select(answer.scores);
        });
        answers.appendChild(button);
      });
    }
  
    function select(add) {
      Object.keys(add).forEach(function (track) {
        scores[track] += add[track];
      });
      index += 1;
      if (index < questions.length) render();
      else finish();
    }
  
    function finish() {
      el("quiz-ui").style.display = "none";
      var best = "cad";
      var top = -1;
      Object.keys(scores).forEach(function (track) {
        if (scores[track] > top) {
          top = scores[track];
          best = track;
        }
      });
      var result = results[best];
      el("result-title").textContent = result.title;
      el("result-why").textContent = result.why;
      el("result-next").textContent = result.next;
      var link = el("result-link");
      link.href = result.path;
      link.textContent = result.label;
      el("result-container").style.display = "block";
    }
  
    var retake = el("retake");
    if (retake) {
      retake.addEventListener("click", function () {
        location.reload();
      });
    }
  
    render();
  })();