pipeline {
    agent any

    environment {
        REPO_DIR = "/opt/devops-repo"
        APP_DIR = "/opt/devops-repo/todo-app"
        COMPOSE_PROJECT_NAME = "todoapp"
    }

    stages {
        stage('Checkout') {
            steps {
                dir("${REPO_DIR}") {
                    deleteDir()
                    git branch: 'main',
                        credentialsId: 'github-creds',
                        url: 'https://github.com/junaaper/DevOps.git'
                }
            }
        }

        stage('Verify Docker') {
            steps {
                sh 'docker --version'
                sh 'docker compose version'
            }
        }

        stage('Deploy') {
            steps {
                dir("${APP_DIR}") {
                    sh '''
                        set -e
                        docker compose -p ${COMPOSE_PROJECT_NAME} down || true
                        docker compose -p ${COMPOSE_PROJECT_NAME} build
                        docker compose -p ${COMPOSE_PROJECT_NAME} up -d
                    '''
                }
            }
        }

        stage('Show Status') {
            steps {
                dir("${APP_DIR}") {
                    sh 'docker compose -p ${COMPOSE_PROJECT_NAME} ps'
                }
            }
        }
    }

    post {
        failure {
            dir("${APP_DIR}") {
                sh 'docker compose -p ${COMPOSE_PROJECT_NAME} logs --no-color || true'
            }
        }
    }
}
