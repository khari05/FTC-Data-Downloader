# Key for easy to miss info
## /api/match/:match-key/participants:
### station:
 - 11 - red1
 - 12 - red2
 - 13 - red3
 - 21 - blue1
 - 22 - blue2
 - 23 - blue3
## /api/match/:match-key/details
### Autonomous
 - `auto_delivered_skystones` - number of skystones delivered during autonomous
 - `auto_delivered_stones` - number of stones delivered during autonomous
 - `auto_returned` - number of stones descored during autonomous
 - `auto_placed` - number of stones placed on the foundation during autonomous
 - `foundation_repositioned` - whether or not the foundation was moved inside the building site during the match
 ### TeleOP
 - `tele_delivered` - number of stones delivered during TeleOP
 - `tele_returned` - number of stones descored
 - `tele_placed` - number of stones placed on foundation during TeleOP
### End Game
 - `robot_1` - the first robot on the team
    - `nav` - whether or not the robot is placed under the alliance's skybridge at the end of autonomous period
    - `parked` - whether or not the robot is in the build site
    - `cap_level` - the level of the capstone on the skyscraper (-1 means it hasn't been scored)
 - `robot_2` - the second robot on the team
    - same options as robot 1
 - `foundation_moved` - whether or not the foundation was moved outside of the build site during end game
 - `tower_bonus` - total points for tallest tower bonus
 - `end_robots_parked` - total amount of robots parked in the build site at the end of end game
### Totals
 - `auto_total` - total points scored in the autonomous period
 - for some reason, `tele_total` returns null so if you want to find that, you will have to add `tower_bonus`, `tele_placed_points`, and `tele_transport_points` then subtract `tele_returned` from the total.
 - `end_total` - total amount of points scored during end game