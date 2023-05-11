pipeline {
    // The “agent” section configures on which nodes the pipeline can be run.
    // Specifying “agent any” means that Jenkins will run the job on any of the
    // available nodes.
	agent any

    stages {
        stage('Git Pull') {
            steps {
                // Get code from a GitHub repository
                // Make sure to add your own git url and credentialsId
				git url: 'https://github.com/VigneshBondugula/MusicJunkies-Backend.git'
		    }
        }
        stage('Build and Test') {
            steps {
                // Maven build, 'sh' specifies it is a shell command
                sh 'npm i && npm test'
            }
        }
        stage('Build Docker Images') {
             steps {
                 sh 'docker build -t vigneshbondugula/mj-backend:latest .'
             }
        }
        stage('Publish Docker Images') {
            steps {
                withDockerRegistry([ credentialsId: "DockerJenkins", url: "" ]) {
                    sh 'docker push vigneshbondugula/mj-backend:latest'
                }
            }
        }
        stage('Clean Docker Images') {
            steps {
               sh 'docker rmi -f vigneshbondugula/mj-backend:latest'
            }
        }
    }
      post {
            always {
                sh 'docker logout'
            }
        }
}