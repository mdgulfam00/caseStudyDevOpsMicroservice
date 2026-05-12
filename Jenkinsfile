pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = "mycasestudywithgenai"
    }

    stages {

        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Clone Repository') {
            steps {
                git branch: 'main',
                    credentialsId: '97ddcab0-eaf0-4975-9875-eaba86068473',
                    url: 'https://github.com/mdgulfam00/caseStudyDevOpsMicroservice.git'
            }
        }

        stage('Verify Docker Installation') {
            steps {
                sh 'docker --version'
                sh 'docker-compose --version'
            }
        }

        stage('Stop Existing Containers') {
            steps {
                sh '''
                    docker-compose down || true
                '''
            }
        }

        stage('Build All Microservices') {
            steps {
                sh '''
                    docker-compose build
                '''
            }
        }

        stage('Start Application Containers') {
            steps {
                sh '''
                    docker-compose up -d
                '''
            }
        }

        stage('Cleanup Unused Docker Images') {
            steps {
                sh '''
                    docker image prune -f
                '''
            }
        }

        stage('Verify Running Containers') {
            steps {
                sh '''
                    docker ps
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Project Manager CI/CD Deployment Successful!'
        }
        failure {
            echo '❌ Project Manager CI/CD Deployment Failed!'
        }
    }
}
