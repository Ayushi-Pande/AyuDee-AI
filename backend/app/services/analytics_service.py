def calculate_analytics(game_results, activities):
    total_games = len(game_results)
    total_activities = len(activities)

    if total_games > 0:
        average_score = sum(
            game.score for game in game_results
        ) / total_games
    else:
        average_score = 0

    return {
        "total_games": total_games,
        "total_activities": total_activities,
        "average_game_score": round(average_score, 2)
    }