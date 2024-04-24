generate:
	mockery --all

test: generate
	go test ./...

.phony: clean test

clean:
	rm -rdf ./internal/__generated__