from datetime import datetime


def format_timestamp(dt: datetime):

    if not dt:
        return None

    return dt.strftime("%Y-%m-%d %H:%M:%S")


def calculate_average(values):

    if not values:
        return None

    return sum(values) / len(values)


def normalize_score(score: int, max_score: int):

    if max_score == 0:
        return 0

    return round(score / max_score, 2)