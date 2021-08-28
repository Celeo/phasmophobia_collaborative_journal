SSH_TARGET := "do"
DISCORD_TAG := "celeo/phasmo_collab_journal"
IMAGE_FILE := "phasmo_collab_journal.image.bin"

dev:
  @uvicorn main:app --reload

build-css:
  @yarn run build:css

build-image:
  podman build . -t {{DISCORD_TAG}}

save-image:
  rm -f {{IMAGE_FILE}}
  podman image save --output {{IMAGE_FILE}} {{DISCORD_TAG}}

deploy: build-image save-image
  rsync -avz --progress {{IMAGE_FILE}} {{SSH_TARGET}}:/srv/{{IMAGE_FILE}}
