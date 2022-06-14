FROM public.ecr.aws/lambda/nodejs:16

WORKDIR /var/task

RUN mkdir dist
RUN mkdir dist/assets

COPY src/ src/
COPY package.json package.json
COPY tsconfig.json tsconfig.json
COPY assets/signature.html dist/assets/signature.html

COPY .github/build/ build/
RUN chmod +x build/node-build.sh

ENTRYPOINT ["/var/task/build/node-build.sh"]
