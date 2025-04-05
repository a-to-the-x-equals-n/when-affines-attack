
# ---- HEART ----
SHELL := /bin/bash
SHELLFLAGS := -eu -o pipefail -c

.ONESHELL:
.PHONY: demo-banner tree pip

# ---- LOCAL CONFIG ----
.SILENT:
.PHONY: install host dev-host client sql sql-status sql-stop

# ---- LOCAL VARS ----
FE = frontend
BE = api
DB = br_web

# ---- GLOBAL VARS ----
PY = python
DEPTH = 5

# COLORS
BU = 94
YW = 93
GR = 92
MG = 35
PR = 38;5;129

# TERMINAL TEXT DISPLAYS
I = $(shell printf '\033[1;$(PR)m')   # entry (magenta)
O = $(shell printf '\033[1;$(BU)m')   # exit (purple)
R = $(shell printf '\033[0m')         # reset

# ---- BANNERS ----
define banner-i
	@PHRASE="$(1)"; \
	WIDTH=$$(tput cols); \
	PHRASE_LEN=$${#PHRASE}; \
	PAD=$$(( (WIDTH - PHRASE_LEN - 2) / 2 )); \
	LEFT=$$(printf "%*s" "$$PAD" ""); \
	RIGHT=$$(printf "%*s" "$$PAD" ""); \
	LINE="$${LEFT// /=} $$PHRASE $${RIGHT// /=}"; \
	LINE=$${LINE:3:$$(( $${#LINE} - 4 ))}; \
	echo "$(I)$${LINE}$(R)"
endef

define banner-o
	@PHRASE="$(1)"; \
	WIDTH=$$(tput cols); \
	PHRASE_LEN=$${#PHRASE}; \
	PAD=$$(( (WIDTH - PHRASE_LEN - 2) / 2 )); \
	LEFT=$$(printf "%*s" "$$PAD" ""); \
	RIGHT=$$(printf "%*s" "$$PAD" ""); \
	LINE="$${LEFT// /=} $$PHRASE $${RIGHT// /=}"; \
	LINE=$${LINE:3:$$(( $${#LINE} - 4 ))}; \
	echo "$(O)$${LINE}$(R)"
endef

# ---- LOCAL TARGETS ----
install: 
	$(call banner-i,INSTALLING DEPENDENCIES)
	@pip install -r $(BE)/requirements.txt
	$(call banner-o,DEPENDENCIES INSTALLED)

host: 
	$(call banner-i,WAKING HOST SERVER)
	@$(PY) $(BE)/run.py
	$(call banner-o,HOST ENDED)

client:
	@cd $(FE)
	$(call banner-i,WAKING CLIENT SERVER)
	@$(PY) -m http.server 8002
	$(call banner-o,CLIENT ENDED)

dev-host: 
	$(call banner-i,WAKING HOST SERVER)
	@$(PY) $(BE)/run.py -D -V
	$(call banner-o,HOST ENDED)

vb-host: 
	$(call banner-i,WAKING HOST SERVER)
	@$(PY) $(BE)/run.py -V
	$(call banner-o,HOST ENDED)

# --- TEST ENDPOINTS ---

test-upload:
	curl -X POST http://localhost:8003/upload -F "image=@api/test/test-image.png" -F "description=A very fine goose"

test-download:
	curl -S GET http://localhost:8003/images

ping:
	curl http://localhost:8003/ping

# ---- SQL TARGETS ----
sql:
	$(call banner-i,WAKING UP MYSQL)
	@sudo service mysql start
	$(call banner-o,SQL RUNNING)
	$(call banner-i,LOGGING IN)
	@mysql -u dev -p $(DB)

sql-status:
	@sudo service mysql status

sql-stop:
	$(call banner-i,EXITING MYSQL)
	@sudo service mysql stop
	$(call banner-o,EXITED)

# ---- GLOBAL TARGETS ----

pip: 
	$(call banner-i,INSTALLING REQUIREMENTS)
	@pip install -r requirements.txt
	$(call banner-o,INSTALLED)

demo-banner:
	$(call banner-i,DEMO)
	$(call banner-o,DEMO FINISHED)

tree:
	$(call banner-i,BUILDING TREEHOUSE)
	@tree -C -L $(DEPTH) -I '__pycache__|*.py[co]|*.sw?|.DS_Store|.git|node_modules|hidden|build|dist|*.egg-info|hide|hidden'
	$(call banner-o,BUILT)