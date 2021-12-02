const reward = require('./lib/rewardStorage');
const utils = require('./lib/utils');
const getTotalGames = (gameArray) => {
    return gameArray.length;
}
const getWinningGames = (gameArray) => {
    return gameArray.filter((game,index) => {return game.gameData.rewardinXDAI !== 0});
}
const getLosingGames = (gameArray) => {
    return getTotalGames(gameArray) - getWinningGames(gameArray);
}
const getWinningPercentage = (gameArray) => {
    return Math.round(getWinningGames(gameArray) / getTotalGames(gameArray) * 100,2);
}
const getLosingPercentage = (gameArray) => {
    return 100 - getWinningPercentage(gameArray);
}
const isGame1 = (attempt) => {
    return ((attempt.time > 17) && (attempt.time <= 22)) || ((attempt.distance >= 100) && (attempt.distance < 102));
}
const isGame2 = (attempt) => {    
    return !isGame1(attempt) && ((attempt.time > 103) && ((attempt.time < 107)) || ((attempt.distance >= 500) && (attempt.distance < 502)));
}
const isGame3 = (attempt) => {    
    return !isGame1(attempt) && !isGame2(attempt) && (((attempt.time > 223) && (attempt.time < 227)) || ((attempt.distance >= 1000) && (attempt.distance < 1002)));
}
const isUnknownGame = (attempt) => {
    return !isGame1(attempt) && !isGame2(attempt) && !isGame3(attempt);
}
module.exports.handler = async (event, context, callback) => {
  await reward.getAll()
    .then((result) => {
      const parsedResult = ((result && result.Items || []));  
      const sortedResults = parsedResult.sort((a,b) => {return a.createdTimestamp - b.createdTimestamp});
      const game1 = sortedResults.filter((result,index) => {return isGame1(result.gameData)});
      const game2 = sortedResults.filter((result,index) => {return isGame2(result.gameData)});
      const game3 = sortedResults.filter((result,index) => {return isGame3(result.gameData)});
      const unknownGame = sortedResults.filter((result, index) => {return !result.gameData || isUnknownGame(result.gameData)});
      const statistics = { statistics :
        [
            {
                game: "Game 1",
                total_games: getTotalGames(game1),
                winning_games: getWinningGames(game1),
                winning_percent: getWinningPercentage(game1),
                losing_games: getLosingGames(game1),
                losing_percent: getLosingPercentage(game1)
            },
            {
                game: "Game 2",
                total_games: getTotalGames(game2),
                winning_games: getWinningGames(game2),
                winning_percent: getWinningPercentage(game2),
                losing_games: getLosingGames(game2),
                losing_percent: getLosingPercentage(game2)
            },
            {
                game: "Game 3",
                total_games: getTotalGames(game3),
                winning_games: getWinningGames(game3),
                winning_percent: getWinningPercentage(game3),
                losing_games: getLosingGames(game3),
                losing_percent: getLosingPercentage(game3)
            },
            {
                game: "Other",
                total_games: getTotalGames(unknown)
            }            
        ]
      };
      console.log('Response body = ' + JSON.stringify(statistics));
      callback(null, utils.createHttpResponse(200, body));
    })
    .catch((error) => {
      console.log('Error promise resolved');
      callback(null, utils.createHttpResponse(500, {message: 'Server error during retrieval of all statistics - ' + error }));
    }); 
}
