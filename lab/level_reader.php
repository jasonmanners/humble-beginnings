<?php

  $level_data_arr = array();
  $file_name = "levels/level1.txt";
  $level_file = fopen($file_name,"r");
  while ($line = fgets ($level_file)) {
    array_push($level_data_arr,str_split(trim($line,"\r\n"),1));
  }
  fclose($level_file);

  $level_data = "<script type='text/javascript'>var level_data = [";
  /*
  $level_data_arr = array(array(1,1,1,1,1,1,1),
                  array(1,1,1,1,1,1,1),
                  array(1,1,1,1,1,1,1),
                  array(1,1,1,1,1,1,1),
                  array(1,1,1,1,1,1,1),
                  array(1,1,1,1,3,1,1),
                  array(1,1,1,1,1,1,1),
                  array(2,2,2,2,2,2,2));
  */
  for($i = 0; $i < sizeof($level_data_arr); $i++) {
    $level_data .= "[";
    for($j = 0; $j < sizeof($level_data_arr[$i]); $j++) {
       $level_data .= "'".$level_data_arr[$i][$j]."'";
       if($j < sizeof($level_data_arr[$i])-1) {
        $level_data .= ",";
       }
    }
    $level_data .= "]";
    if($i < sizeof($level_data_arr)-1) {
      $level_data .= ",";
    }
  }
  
  $level_data .= "];</script>";
?>

<html>
  <head>
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js"></script> 
		<link rel="stylesheet" href="css/styles_ui.css" />
  </head>
  <body>
    <canvas id="world"></canvas>
    <!--div>
      <section id="menu" class="ui">
        <h2 id="title">Game Title</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor 
        incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
        exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <ul>
          <li><a href="#" id="start_game" class="button">Start Campaign</a></li>
          <li><a href="#" id="start_challenges" class="button">Challenges</a></li>
          <li><a href="#" id="view_highscore" class="button">View Highscores</a></li>
        </ul>
      </section>
    </div-->
    <p id="output"></p>
    <div id="level_data">
    <?php echo $level_data; ?>
    </div>
    <script type="text/javascript" src="js/level_reader.js"></script>
  </body>
</html>