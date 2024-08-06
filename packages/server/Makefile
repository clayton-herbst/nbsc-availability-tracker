# run the goserver image
# host network required due to containerd quirks (rootless related I believe)
run: build
	nerdctl run --rm --it --network host goserver

# run the unit tests for the goserver package
test: generate-mocks
	go test ./...

# build the goserver container image in the default namespace
build:
	nerdctl build -t goserver --rm .

# move a container image into the k8s.io namespace
k8s-move:
	mkdir -p ./out
	nerdctl image save goserver:latest -o ./out/goserver.tar
	nerdctl --namespace k8s.io image load -i ./out/goserver.tar

# generate interface mocks for unit tests 
generate-mocks:
	mockery --all

.phony: clean test

clean:
	rm -rdf ./internal/__generated__ ./out