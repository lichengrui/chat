function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function role_assign(n) {
  var Roles = ["Villager","Werewolf","Seer","Robber","Troublemaker","Tanner","Drunk","Hunter","Mason","Insomniac","Minion"]
  var dist = []
  var list = []
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
      list.push(Roles[i])
    } 
  } 
  return shuffle(list);   // The function returns the product of p1 and p2
}

function fuck(roles,inputs){
  var original_roles = roles.slice()
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
  
  console.log(output)
  console.log(roles)
  console.log(werewolf)
  console.log(mason)
  return;
 }
 
 function vote(votes){
  tally = Array(votes.length).fill(0);
  max = 0
  result=[]
  for(i = 0; i<votes.length;i++){
    tally[votes[i]] += 1;
  }
  for(i = 0; i<tally.length;i++){
    if(tally[i]>max){
    	max = results[i]
    }
  }
  for(i = 0; i<tally.length;i++){
    if(tally[i]==max){
    	results.push(i)
    }
  }
  return results;
}
 