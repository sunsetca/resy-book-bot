import logging
from github import Github


class GithubClient:
    issue_level = {
        1: "bug",
        2: "enhancement",
        3: "help wanted",
    }

    def __init__(self, auth_token, repo, logger: logging.Logger):
        self.repo =  Github(auth_token).get_repo(repo)
        self.github_logger = logger
    
    def create_issue(self, title, body, level):
        self.github_logger.info(f"Creating an issue with title: {title} and body: {body}")
        try:
            self.repo.create_issue(title=title, body=body, labels=[self.issue_level[level]])
        except Exception as e:
            self.github_logger.error(f"Failed to create an issue with title: {title} and body: {body} due to {e}")
        return