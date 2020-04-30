/*******************************************************************
Function: shuffle
  Inputs(1): an array
  Output(1): shuffled array
*******************************************************************/
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/*******************************************************************
Function: role_assign
  Inputs(1): integer of number of players
  Output(1): shuffled roles with (input)+3 roles with the last three being cards on the table
*******************************************************************/
function role_assign(n) {
  var Roles = ["Villager","Werewolf","Seer","Robber","Troublemaker","Tanner","Drunk","Hunter","Mason","Insomniac","Minion"]
  var directions = ["Villagers do nothing at night","Werewolfs will know who the other werewolfs are at night", "Seers can choose two unassigned roles or another person's role to look at","Robber has to switch out their own role with another person's","Troublemaker switches two people's roles","Tanner's role is to die", "Drunk has to switch out their own role with another role in the middle", "There is another Mason in the village, you will know who it is", "Insomiac will have the opportunity to check their own role at the end of the night", "Minion will know who all of the werewolves are"]
  var needed_inputs = [0,0,3,1,2,0,4,0,0,0,0]
  /*
    For Needed Inputs:
      1: One of the other assigned roles
      2: Two of the other assigned roles
      3: One assigned role OR Two unassigned roles
      4: One unassigned role
  */
  var dist = []
  var list = []
  var shuffled_list = []
  var output_roles = []
  var output_directions = []
  var output_needed_inputs = []
  switch(n) {
    case 3:
      dist = [1,2,1,1,1,0,0,0,0,0,0]
      break;
    case 4:
      dist = [2,2,1,1,1,0,0,0,0,0,0]
      break;
    case 5:
      dist = [3,2,1,1,1,0,0,0,0,0,0]
      break;
    case 6:
      dist = [4,2,1,1,1,0,0,0,0,0,0]
      break;
    case 7:
      dist = [5,2,1,1,1,0,0,0,0,0,0]
      break;
    case 8:
      dist = [6,2,1,1,1,0,0,0,0,0,0]
      break;
    case 9:
      dist = [7,2,1,1,1,0,0,0,0,0,0]
      break;
    case 10:
      dist = [8,2,1,1,1,0,0,0,0,0,0]
      break;
    default:
      // code block
  } 
  for (i = 0; i < dist.length; i++) {
    for (j = 0; j < dist[i]; j++) {
      list.push([Roles[i],directions[i],needed_inputs[i]])
    } 
  } 
  shuffled_list = shuffle(list)
  for (i = 0; i < shuffled_list.length; i++) {
    output_roles.push(shuffled_list[i][0])
    output_directions.push(shuffled_list[i][1])
    output_needed_inputs.push(shuffled_list[i][2])
  } 
  return [output_roles,output_directions,output_needed_inputs];
}

/*******************************************************************
Function: role_assign
  Inputs(2): 
    1. original_roles - from function role_assign
    2. inputs - User inputs for people and their respective roles. Length should be 3 less than roles and -1 for roles that don't have inputs
  Output(2): 
    1. Output - String that each player sees. Should be length of "inputs"
    2. roles - everyone's new roles
*******************************************************************/
function one_night(original_roles,inputs){
  var roles = original_roles.slice()
  var output = Array(inputs.length).fill("")
  var temp = 0
  var werewolf = []
  var mason = []
  var string = ""
  for(i = 0; i<inputs.length;i++){ 
    if(original_roles[i]=="Robber"){
      roles[i] = roles[inputs[i]]
      roles[inputs[i]] = "Robber"
      console.log(inputs[i])
      output[i]=`You have changed your roles with ${inputs[i]}`
    }else if(original_roles[i]=="Werewolf"){
      werewolf.push(i)
    }else if(original_roles[i]=="Mason"){
      mason.push(i)
    }
  }
    for(i = 0; i<inputs.length;i++){
    switch(original_roles[i]) {
      case "Villager":
        output[i]="You're a lazy fuck that didn't do anything but masturbate at night"
        break
      case "Werewolf":
        string = "The Werewolves are:"
        output[i]= string.concat(werewolf.toString())
        break
      case "Minion":
        string = "The Werewolves are:"
        output[i]= string.concat(werewolf.toString())
        break
      case "Seer":
        if(inputs[i].length == 2){
          output[i] = `The role of (${inputs[i][0]}) is ${roles[inputs[i][0]]} and The role of (${inputs[i][1]}) is ${roles[inputs[i][1]]}`
        }else if(inputs[i].length == 1){
          output[i] = `The role of (${inputs[i][0]}) is ${original_roles[inputs[i][0]]}`
        }
        break
      case "Troublemaker":
        temp = roles[inputs[i][0]]
        roles[inputs[i][0]] = roles[inputs[i][1]]
        roles[inputs[i][1]] = temp
        output[i]=`Roles (${inputs[i][0]}) and (${inputs[i][1]}) have been changed`
        break
      case "Tanner":
        output[i]="Time to die"
        break
      case "Drunk":
        roles[i] = roles[inputs[i]]
        roles[inputs[i]] = "Drunk"
        output[i]="You have no idea what the fuck you are"
        break
      case "Hunter":
        output[i]="Wow, a hunter that's too scared to hunt at night"
        break
      case "Mason":
        string = "The Masons are:"
        output[i]= string.concat(mason.toString())
        break
    }
  }
  
  for(i = 0; i<inputs.length;i++){
    switch(original_roles[i]) {
      case "Insomniac":
        output[i]=`Your role is ${roles[i]}`
        break
    }
  }
  return output,roles;
}
 
/*******************************************************************
Function: role_assign
  Inputs(1): User votes as integers
  Output(1): return array of people voted
*******************************************************************/
function vote(votes){
  tally = Array(votes.length).fill(0);
  max = 0
  results=[]
  for(i = 0; i<votes.length;i++){
    tally[votes[i]] += 1;
  }
  for(i = 0; i<tally.length;i++){
    if(tally[i]>max){
    	max = tally[i]
    }
  }
  for(i = 0; i<tally.length;i++){
    if(tally[i]==max && max > 1){
    	results.push(i)
    }
  }
  return results;
}