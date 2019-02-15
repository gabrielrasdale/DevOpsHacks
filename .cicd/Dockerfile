#
# FROM section
#
FROM node:8

###############################################################################
#
# ENV - Environment variables section
# Set variables and locales
#
###############################################################################
ENV DESC="Example Server"
ENV APPDIR="/usr/src/app"
ENV DATADIR="/data"
ENV CONFDIR="/conf"

###############################################################################
#
# ARG - Arguments section
# Set arguments on build
#
###############################################################################
ARG BRANCH
ARG VERSION
ARG IMAGE
ARG GIT_URL


###############################################################################
#
# ACTIONS section: for COPY and RUN commands
#
# Install any dependancies using '&&' to combine commands that should be in the
# same 'layer' in order to minimise the number of tasks that actually need to
# be run on subsequent builds
#
###############################################################################
RUN mkdir -p ${APPDIR}
WORKDIR ${APPDIR}

# Install app dependencies
COPY package.json ${APPDIR}
RUN npm install

# Copy repo into APPDIR (remember .dockerignore contents are ignored)
COPY . ${APPDIR}



###############################################################################
#
# tell the port number(s) the container should expose
#
# Expose ports.
#   - 8080: web UI
EXPOSE 3000

###############################################################################
#
# CMD section:
# run the application
#

CMD [ "npm", "start" ]
