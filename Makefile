SHELL := /bin/bash
SHELLFLAGS := -eu -o pipefail -c

.ONESHELL:
.PHONY: host client pip dev-host

DIR = frontend
PY = python

WH_BG = 47
BU = 94
YW = 93
GR = 92
TX_IN = $(shell printf '\033[1;$(YW);$(WH_BG)m')
TX_OUT = $(shell printf '\033[1;$(GR);$(WH_BG)m')
R = $(shell printf '\033[0m')

pip: 
	@echo "$(TX_IN)- INSTALLING DEPENDENCIES -$(R)"
	@pip install -r backend/requirements.txt
	@echo "$(TX_OUT)- DEPENDENCIES INSTALLED-$(R)"

host: pip
	@echo "$(TX_IN)- STARTING HOST -$(R)"
	@$(PY) backend/run.py
	@echo "$(TX_OUT)- HOST ENDED -$(R)"

dev-host:
	@echo "$(TX_IN)- STARTING HOST SERVER -$(R)"
	@$(PY) backend/run.py
	@echo "$(TX_OUT)- HOST ENDED -$(R)"
	
client:
	@cd $(DIR)
	@echo "$(TX_IN)- STARTING CLIENT SERVER -$(R)"
	@$(PY) -m http.server 8002
	@echo "$(TX_OUT)- CLIENT ENDED -$(R)"