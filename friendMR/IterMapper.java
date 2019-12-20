import org.apache.hadoop.mapreduce.*;

public class IterMapper extends Mapper<LongWritable, Text, Text,Text>
{
	
	public void map(LongWritable key, Text value,Context context)  throws IOException,InterruptedException
	{
		String line = value.toString();
		String[] parts = line.split("\t");
	    String from = parts[0];

		String[] values = parts[1].split(";");
		String[] currentLabels = values[0].split(",");
        String[] neighborsWeights = values[1].split(",");
		
		for (int i = 0; i < currentLabels.length; i++){
            for (int j = 0; j < neighborsWeights.length; j++){
                StringBuffer out = new StringBuffer();

                String labelName = currentLabels[i].substring(0, currentLables[i].indexOf("-"));
                String toInterest = neighborsWeights[h].substring(0, neighborsWeights[j].indexOf("-"));
                String labelWeight = currentLabels[i].substring(currentLables[i].indexOf("-")+1);
                String edgeWeight = neighborsWeights[j].substring(neighborsWeights[j].indexOf("-")+1);
                Double newWeight = Double.parseDouble(labelWeight) * Double.parseDouble(edgeWeight);
                
                out.append(from);
                out.append(";");
                out.append(labelName);
                out.append("-");
                out.append(newWeight);

                context.write(new Text(toInterest), new Text(out.toString()));

            }
        }
		
		
	}

}