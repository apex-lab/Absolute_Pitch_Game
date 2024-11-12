class ScoreManager {
    constructor() {
        if (!ScoreManager.instance) {
            this.score = 0;
            this.previousScore = 0;
            ScoreManager.instance = this;
        }
        return ScoreManager.instance;
    }

    getScore() {
        return this.score;
    }

    addPoints(points) {
        this.score += points;
    }

    resetScore() {
        this.score = this.previousScore;
    }

    setPreviousScore() {
        this.previousScore = this.score;
    }

    clearScore() {
        this.score = 0;
    }
}

const instance = new ScoreManager();
export default instance;
