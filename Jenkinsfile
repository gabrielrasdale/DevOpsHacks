def VERSION = 'unknown'
def GIT_VERSION = 'unknown'
def BRANCH = 'unknown'
def GIT_URL = scm.userRemoteConfigs[0].url

pipeline {

    options {
        buildDiscarder(logRotator(numToKeepStr: '3'))
    }

    agent any

    environment {
        PROJECT  = 'ios-calc'
        IMAGE    = 'ios-calc:latest'
        NXURL    = 'https://nexus.red.lab.aonanalytics.com'
        NXCRED   = 'nx-cicd-deploy'
    }


    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build preparation') {
            steps {
                script {
                    BRANCH = sh(returnStdout: true, script: 'git rev-parse --abbrev-ref HEAD').trim()
                    GIT_VERSION = sh(returnStdout: true, script: 'git describe --always').trim().replace(",", ".")
                    VERSION = "${GIT_VERSION}.${BUILD_NUMBER}"
                    // set the build display name
                    currentBuild.displayName = "#${VERSION}"
                    IMAGE = "$PROJECT:$VERSION"
                }

            }
        }

        stage('Docker build') {
            steps {
                script {
                    if (fileExists("./.cicd/Dockerfile-${BRANCH}")) {
                        echo "Build the docker image using the custom Dockerfile matching branch in .cicd/Dockerfile-${BRANCH}"
                        docker.build("$IMAGE", "--build-arg VERSION=${VERSION} --build-arg IMAGE=${IMAGE} --build-arg BRANCH=${BRANCH} --build-arg GIT_URL=${GIT_URL} --file ./.cicd/Dockerfile-${BRANCH} .")
                    } else {
                        echo "Build the docker image using the default Dockerfile"
                        docker.build("$IMAGE", "--build-arg VERSION=${VERSION} --build-arg IMAGE=${IMAGE} --build-arg BRANCH=${BRANCH} --build-arg GIT_URL=${GIT_URL} --file ./.cicd/Dockerfile .")
                    }
                }
            }
        }

        stage('Docker push to Artifact repo') {
            steps {
                script {
                    docker.withRegistry(NXURL, NXCRED) {
                        docker.image(IMAGE).push("${VERSION}")
                        docker.image(IMAGE).push("${GIT_VERSION}")
                        docker.image(IMAGE).push("${BRANCH}")
                        docker.image(IMAGE).push("latest")
                    }

                }
            }
        }

        stage('Conditional deploy to CNODE:dev') {
            when {
                branch 'master'
            }
            environment {
                CICD_SSH_HOST            = "dev"
                CICD_USER_NAME           = "cicd"
                CICD_DOCKER_COMPOSE_FILE = "./.cicd/docker-compose-${BRANCH}.yml"
                CICD_PROJECT_NAME        = "${PROJECT}"
                CICD_REGISTRY_URL        = "https://registry.red.lab.aonanalytics.com"
                CICD_REGISTRY_CRED       = credentials('nx-cicd-deploy')
            }
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: "cicd-deploy", keyFileVariable: 'CICD_SSH_IDENTITY')]) {
                    sh "/usr/local/bin/deploy-docker-compose-via-ssh-v2 -y"
                }
            }
        }

        stage('Conditional deploy to CNODE:prodtest') {
            when {
                branch 'prodtest'
            }
            environment {
                CICD_SSH_HOST            = "prodtest"
                CICD_USER_NAME           = "cicd"
                CICD_DOCKER_COMPOSE_FILE = "./.cicd/docker-compose-${BRANCH}.yml"
                CICD_PROJECT_NAME        = "${PROJECT}"
                CICD_REGISTRY_URL        = "https://registry.red.lab.aonanalytics.com"
                CICD_REGISTRY_CRED       = credentials('nx-cicd-deploy')
            }
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: "cicd-deploy", keyFileVariable: 'CICD_SSH_IDENTITY')]) {
                    sh "/usr/local/bin/deploy-docker-compose-via-ssh-v2 -y"
                }
            }
        }

    }

    post {

        success {
            // make sure that the Docker image is removed
            sh "docker rmi $IMAGE | true"
        }

    }

}

