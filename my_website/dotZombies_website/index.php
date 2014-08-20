<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="css/styles.css" />
    <link href="http://fonts.googleapis.com/css?family=IM+Fell+DW+Pica+SC:regular" rel="stylesheet" type="text/css">
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js"></script>
    <script type="text/javascript">
      /*********************************
       *  Google Analytics Code
       * *******************************/ 
      var _gaq = _gaq || [];
      _gaq.push(['_setAccount', 'UA-24849608-1']);
      _gaq.push(['_trackPageview']);

      (function() {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
      })();
      
      $(document).ready(function() {
        $("#contact").click(function(){
            var currentDisplay = $("#contact_form").css("display");
            if(currentDisplay === "none") {
              $("#contact_form").css("display","block");
            }
            else {
              $("#contact_form").css("display","none");
            }
            return false;
        });
      });
    </script>
    <title>dotZombies</title>
  </head>
  <body>
    <section class="content">
      <h1>dotZombies</h1>
      <h5>Coming to swarm you soon</h5>
      <a href="#" class="contact" id="contact"><img src="media/zombie_hand.png" title="Contact Us" height="96px" width="68px"/></a>
      <article class="contact_form" id="contact_form">
        <h4>Contact Me</h4>
        <?php 
        if ($_POST["email"]<>'') { 
          $ToEmail = 'sorcereroftechnology@gmail.com'; 
          $EmailSubject = 'dotZombies Comment'; 
          $mailheader = "From: ".$_POST["email"]."\r\n"; 
          $mailheader .= "Reply-To: ".$_POST["email"]."\r\n"; 
          $mailheader .= "Content-type: text/html; charset=iso-8859-1\r\n"; 
          $MESSAGE_BODY = "Name: ".$_POST["name"]."<br>"; 
          $MESSAGE_BODY .= "Email: ".$_POST["email"]."<br>"; 
          $MESSAGE_BODY .= "Comment: ".nl2br($_POST["comment"])."<br>"; 
          
          $validation = $_POST["answer"];
          if($validation == 42) {
            mail($ToEmail, $EmailSubject, $MESSAGE_BODY, $mailheader) or die ("Failure"); 
          }
        ?> 
        Your message was sent
        <?php 
        } else { 
        ?> 
        <form action="index.php" method="post">
          <ul>
            <li><label for="email">Email</label><input name="email" type="text" id="email" size="32"></li>
            <li><label for="name">Name</label><input name="name" type="text" id="name" size="32"></li>
            <li><label for="comment">Comment</label><textarea name="comment" cols="35" rows="6" id="comment" class="bodytext"></textarea></li>
            <li><label for="answer">Answer to the Ultimate Question of Life, the Universe, and Everything (20+22)</label><input name="answer" type="text" id="answer" size="32"></li>
            <li><input type="submit" name="Submit" value="Send" id="submit_form"></li>
          </ul>
        </form> 
        <?php 
        }; 
        ?>
      </article>
    </section>
  </body>
</html>